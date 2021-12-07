import fuzzysort from "fuzzysort";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import { toReadableDateString } from "../../shared/utils/dates";
import { capitalizeAll } from "../../shared/utils/strings";
import SearchIcon from "../src/components/svg/search-icon";
import { fetchEntries } from "../src/utils/fetch-entries";
import { linkStyles } from "../src/utils/global-styles";

const ALL_CATEGORY = "all";

export default function Home({ entries, categories }) {
  const router = useRouter();
  // Load category from URL #/{category} path or default to ALL
  const [selectedCategory, setSelectedCategory] = useState(
    router.asPath !== "/" ? router.asPath.replace("/#", "") : ALL_CATEGORY
  );
  const [searchQuery, setSearchQuery] = useState("");
  let filteredEntries = entries;
  if (searchQuery) {
    filteredEntries = fuzzysort
      .go(searchQuery, entries, {
        keys: ["title", "category", "preview"],
        scoreFn: (keysResult) => {
          const titleRes = keysResult[0];
          const categoryRes = keysResult[1];
          const previewRes = keysResult[2];
          let score = Math.max(
            titleRes ? titleRes.score : -Infinity,
            categoryRes ? categoryRes.score : -Infinity,
            previewRes ? previewRes.score : -Infinity
          );
          // When all three keys, prioritize over just one two
          if (titleRes?.score && categoryRes?.score && previewRes?.score) {
            score = score + 1500;
          } else if (
            (titleRes?.score && categoryRes?.score) ||
            (titleRes?.score && previewRes?.score)
          ) {
            // When title and one other key, prioritize next
            score = score + 1000;
          } else if (titleRes?.score) {
            // When just title, prioritize title over other combos or singles
            score = score + 500;
          }
          return score;
        },
      })
      .map((e) => e.obj);
  }
  const EntriesRender = useMemo(
    () =>
      filteredEntries.map((entry) => {
        // Only map entries in selected category
        if (
          selectedCategory !== ALL_CATEGORY &&
          entry.category !== selectedCategory
        ) {
          return null;
        }
        return (
          <Link key={entry.slug} href={`/${entry.slug}`} passHref>
            <Entry>
              <EntryContents>
                <EntryRow>
                  <EntryTitle>{entry.title}</EntryTitle>
                  <EntryCategory>{capitalizeAll(entry.category)}</EntryCategory>
                </EntryRow>
                <EntryDate>{toReadableDateString(entry.date)}</EntryDate>
                <EntryPreview>{entry.preview}</EntryPreview>
              </EntryContents>
            </Entry>
          </Link>
        );
      }),
    [filteredEntries, selectedCategory]
  );
  const CategoriesRender = useMemo(
    () =>
      [ALL_CATEGORY, ...categories].map((category) => {
        if (typeof window === "undefined") {
          return null;
        }
        return (
          <Category
            key={category}
            active={category === selectedCategory}
            onClick={() => {
              // Update URL to url/#category on new category select
              if (category !== ALL_CATEGORY) {
                router.push(`#${category}`, undefined, { shallow: true });
              } else {
                router.push(`/`, undefined, { shallow: true });
              }
              setSelectedCategory(category);
            }}
          >
            {capitalizeAll(category)}
          </Category>
        );
      }),
    [router, categories, selectedCategory]
  );
  return (
    <PageWrapper>
      <HeadingContent>
        <TitleWrapper>
          <Title>Writing</Title>
          <SubTitle>by Evan Bonsignori</SubTitle>
        </TitleWrapper>
        <AboutLink href={process.env.ABOUT_PAGE_URL}>About</AboutLink>
        <SubHeadingContent>
          <Categories>{CategoriesRender}</Categories>
          <SearchWrapper>
            <StyledSearchIcon />
            <Search
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
        </SubHeadingContent>
      </HeadingContent>
      <Entries>{EntriesRender}</Entries>
    </PageWrapper>
  );
}

export async function getStaticProps() {
  const entries = fetchEntries();
  const categories = {};
  for (const entry of Object.values(entries)) {
    if (!categories[entry.data.category]) {
      categories[entry.data.category] = true;
    }
  }
  const sortedEntries = Object.values(entries)
    .map((entry) => {
      return {
        ...entry.data,
        date: entry.data.date.toString(),
      };
    })
    .sort((a, b) => a.date > b.date);
  return {
    props: { entries: sortedEntries, categories: Object.keys(categories) },
  };
}

const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100vw;
  max-width: 100vw;
`;

const HeadingContentBreakpoints = setEachBreakpoint({
  xs: `
  max-width: 90vw;
  width: 90vw;
  padding: 5vw;
  row-gap: 7.5vw;
  padding-bottom: 3vw;
  `,
  lg: `
  max-width: 96vw;
  width: 96vw;
  padding: 2vw;
  row-gap: 1vw;
  grid-template-rows: 1fr;
  `,
  xl: `
  max-width: 96vw;
  width: 96vw;
  padding: 2vw;
  padding-bottom: 1vw;
  row-gap: 1vw;
  grid-template-rows: 1fr;
  `,
  xxl: `
  max-width: 96vw;
  width: 96vw;
  padding: 1.75vw;
  row-gap: 1vw;
  padding-bottom: 1vw;
  grid-template-rows: 1fr;
  `,
});
const HeadingContent = styled.div`
  align-self: center;
  display: grid;
  align-items: baseline;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
  max-width: 94vw;
  width: 94vw;
  padding: 3vw;
  row-gap: 2.5vw;
  padding-bottom: 2vw;
  ${HeadingContentBreakpoints}
`;

const TitleWrapperBreakpoints = setEachBreakpoint({
  xs: `
  flex-direction: column;
  grid-column: 1 / 3;
  `,
});
const TitleWrapper = styled.div`
  display: flex;
  grid-row: 1;
  grid-column: 1;
  flex-direction: row;
  align-items: baseline;
  ${TitleWrapperBreakpoints}
`;

const TitleAndLinkBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 2.25rem;
  `,
  sm: `
  font-size: 2.5rem;
  `,
  md: `
  font-size: 2.5rem;
  `,
  lg: `
  font-size: 3rem;
  `,
  xl: `
  font-size: 4rem;
  `,
  xxl: `
  font-size: 5rem;
  `,
});
const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  line-height: 1em;
  ${TitleAndLinkBreakpoints}
`;

const SubTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.175rem;
  `,
  sm: `
  font-size: 1.25rem;
  `,
  md: `
  font-size: 1.25rem;
  `,
  lg: `
  font-size: 1.5rem;
  `,
  xl: `
  font-size: 2rem;
  `,
  xxl: `
  font-size: 2.5rem;
  `,
});
const SubTitle = styled.h2`
  color: var(--secondary);
  margin: 0;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1em;
  margin-left: 0.5em;
  ${SubTitleBreakpoints}
`;

const AboutLink = styled.a`
  font-weight: 200;
  font-size: 1.5rem;
  margin-left: auto;
  line-height: 1em;
  grid-row: 1;
  grid-column: 3;
  ${linkStyles}
  color: var(--primary);
  ${TitleAndLinkBreakpoints}
`;

const SubHeadingContentBreakpoints = setEachBreakpoint({
  xs: `
  grid-row: 2;
  grid-column: 1 / 4;
  font-size: 1.1rem;
  `,
  sm: `
  grid-row: 2;
  font-size: 1.1rem;
  grid-column: 1 / 4;
  `,
  md: `
  grid-row: 2;
  font-size: 1.1rem;
  `,
  lg: `
  margin-bottom: 0;
  font-size: 1.2rem;
  `,
  xl: `
  margin-bottom: 0;
  font-size: 1.4rem;
  `,
  xxl: `
  margin-bottom: 0;
  font-size: 1.8rem;
  `,
});
const SubHeadingContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1em;
  grid-column: 2;
  grid-row: 1;
  ${SubHeadingContentBreakpoints}
`;

const Categories = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CategoryProps = (props) =>
  props.active &&
  `
  color: var(--primary);
  :hover {
    color: var(--primary);
    cursor: initial;
  }
`;
const Category = styled.h2`
  margin: 0;
  user-select: none;
  ${linkStyles}
  color: var(--font);
  margin-right: 1em;
  ${CategoryProps}
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const SearchBreakpoints = setEachBreakpoint({
  xs: `
  margin-right: 6vw;
  `,
  sm: `
  margin-right: 4vw;
  font-size: 1.2rem;
  `,
  md: `
  font-size: 1.2rem;
  `,
  lg: `
  font-size: 1.1rem;
  `,
  xl: `
  font-size: 1.4rem;
  margin-right: 2vw;
  `,
  xxl: `
  font-size: 1.8rem;
  margin-right: 2vw;
  `,
});
const Search = styled.input`
  height: fit-content;
  margin-right: 3vw;
  background-color: inherit;
  border: none;
  border-bottom: 1px solid var(--background-accent);
  color: var(--font);
  font-size: 1rem;

  :focus {
    border-bottom: 1px solid var(--primary);
  }
  ${SearchBreakpoints}
`;
const StyledSearchIconBreakpoints = setEachBreakpoint({
  xs: `
  width: 6vw;
  `,
  sm: `
  width: 4vw;
  `,
  lg: `
  width: 2.5vw;
  `,
  xl: `
  width: 2vw;
  `,
  xxl: `
  width: 2vw;
  `,
});
const StyledSearchIcon = styled(SearchIcon)`
  height: auto;
  width: 3vw;
  margin-right: 5px;
  fill: var(--background-accent);
  ${StyledSearchIconBreakpoints}
`;

const Entries = styled.div`
  display: flex;
  flex-direction: column;
`;

const EntryBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.2rem;
  width: 98vw;
  margin: 0 auto;
  padding: 7vw 0;
  `,
  sm: `
  font-size: 1.2rem;
  width: 75vw;
  margin: 0 auto;
  padding: 5vw 0;
  `,
  md: `
  font-size: 1.2rem;
  width: 70vw;
  margin: 0 auto;
  padding: 5vw 0;
  `,
  lg: `
  font-size: 1.25rem;
  width: 60vw;
  margin: 0 auto;
  padding: 4vw 0;
  `,
  xl: `
  font-size: 1.3rem;
  width: 50vw;
  margin: 0 auto;
  padding: 3vw 0;
  `,
  xxl: `
  font-size: 1.65rem;
  width: 50vw;
  margin: 0 auto;
  padding: 2vw 0;
  `,
});
const Entry = styled.div`
  background: var(--background);
  font-family: "adelle-sans", sans-serif;
  font-weight: 100;
  margin: 0 auto;
  border-bottom: 1px solid var(--background-accent);
  margin: 0 auto;
  padding: 5vw 0;
  :hover {
    background: var(--background-accent);
    cursor: pointer;
  }
  ${EntryBreakpoints}
`;

const EntryContents = styled.div`
  margin: 0 auto;
  width: 80%;
`;

const EntryRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const EntryTitle = styled.h3`
  margin: 0;
  color: var(--secondary);
`;
const EntryCategory = styled.h4`
  margin: 0;
  margin-left: auto;
  color: var(--primary);
`;
const EntryDate = styled.div`
  font-weight: 100;
  margin-top: 5px;
  color: var(--font-secondary);
`;
const EntryPreview = styled.p`
  margin: 0;
  margin-top: 10px;
`;
