import fuzzysort from "fuzzysort";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import styled from "styled-components";

import Copyright from "../../shared/components/copyright";
import Header from "../../shared/components/header";
import { ASCENDING, DESCENDING } from "../../shared/constants/sort";
import TagIcon from "../../shared/svgs/tag-icon";
import { toReadableDateString } from "../../shared/utils/dates";
import { responsiveBackgroundImageUrl } from "../../shared/utils/image";
import { capitalizeAll } from "../../shared/utils/strings";
import Meta from "../src/components/meta";
import DateIcon from "../src/svgs/date-icon";
import { fetchEntries } from "../src/utils/fetch-entries";
import { linkStyles } from "../src/utils/global-styles";

const ALL_CATEGORY = "all";
const ITEMS_PER_PAGE = 5;
const PAGINATE_OFFSET = 200;

const sortByOpts = [
  { key: "date", direction: DESCENDING, label: "Newest First" },
  { key: "popularity", direction: DESCENDING, label: "Most Read" },
  { key: "date", direction: ASCENDING, label: "Oldest First" },
  { key: "popularity", direction: ASCENDING, label: "Least Read" },
];

export default function Home({ entries, categories }) {
  const router = useRouter();
  const entriesRef = useRef(null);
  const headerRef = useRef(null);
  // Load category from URL #/{category} path or default to ALL
  const [selectedCategory, rawSetSelectedCategory] = useState(
    router.asPath !== "/" ? router.asPath.replace("/#", "") : ALL_CATEGORY
  );
  const setSelectedCategory = useCallback(
    (category) => {
      if (category !== ALL_CATEGORY) {
        router.push(`#${category}`, undefined, { shallow: true });
      } else {
        router.push(`/`, undefined, { shallow: true });
      }
      rawSetSelectedCategory(category);
    },
    [router]
  );

  const [paginationCount, setPaginationCount] = useState(ITEMS_PER_PAGE + 5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(sortByOpts[0]);

  const maxPages = useMemo(() => entries.length + ITEMS_PER_PAGE, [entries]);
  let filteredEntries = entries;

  // Pagination scroll detect
  const onScroll = useCallback(
    (e) => {
      if (paginationCount > maxPages) {
        return;
      }
      const node = e.target;
      if (entriesRef.current && headerRef.current) {
        const totalHeight =
          entriesRef.current.scrollHeight + headerRef.current.scrollHeight;
        const currentScroll = node.scrollTop + node.clientHeight;
        if (totalHeight - PAGINATE_OFFSET <= currentScroll) {
          setPaginationCount((prev) => prev + ITEMS_PER_PAGE);
        }
      }
    },
    [paginationCount, maxPages]
  );

  filteredEntries = useMemo(() => {
    if (!searchQuery) {
      return filteredEntries;
    }
    return fuzzysort
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
  }, [filteredEntries, searchQuery, entries]);

  // Sort entries
  filteredEntries = useMemo(
    () =>
      [...filteredEntries].sort((a, b) => {
        const isAscending = sortBy.direction === ASCENDING ? 1 : -1;
        let aCompare = a[sortBy.key];
        let bCompare = b[sortBy.key];
        if (sortBy.key === "date") {
          aCompare = new Date(aCompare);
          bCompare = new Date(bCompare);
        }
        if (aCompare > bCompare) {
          return isAscending;
        }
        return -isAscending;
      }),
    [filteredEntries, sortBy]
  );

  // Filter entries by categories
  filteredEntries = useMemo(
    () =>
      filteredEntries.filter((entry) => {
        // Only map entries in selected category
        if (
          selectedCategory !== ALL_CATEGORY &&
          !entry.categories.includes(selectedCategory)
        ) {
          return false;
        }
        return true;
      }),
    [filteredEntries, selectedCategory]
  );

  // Paginate entries
  filteredEntries = useMemo(
    () => filteredEntries.slice(0, paginationCount),
    [filteredEntries, paginationCount]
  );

  const EntriesRender = useMemo(() => {
    if (!filteredEntries.length) {
      const image = `
        background-image: url("https://i.imgur.com/uwZZ2Xq.jpeg");
      `;
      return (
        <Entry>
          <EntryMeta>
            <EntryPhoto backgroundImage={image}></EntryPhoto>
            <EntryDetails>Harold understands your pain</EntryDetails>
          </EntryMeta>
          <EntryContents>
            <h1>No Articles Found</h1>
            <p>Nothing was found for your search parameters.</p>
          </EntryContents>
        </Entry>
      );
    }
    return filteredEntries.map((entry, index) => {
      const isAlt = index % 2 === 1;
      let image = `
        background-image: url("${entry.image}");
      `;
      if (!entry.image?.includes("://")) {
        image = responsiveBackgroundImageUrl(entry.image, true, "writing");
      }
      const entryCategories = entry.categories.map((category, catIndex) => (
        <li
          key={`${entry.slug}-${category}-${catIndex}`}
          onClick={() => setSelectedCategory(category)}
        >
          <a>{capitalizeAll(category)}</a>
        </li>
      ));
      const readableDate = toReadableDateString(entry.date);

      return (
        <LazyLoadComponent key={`lazy-${entry.slug}`}>
          <Entry isAlt={isAlt}>
            <EntryMeta>
              <EntryPhoto backgroundImage={image}></EntryPhoto>
              <EntryDetails isAlt={isAlt}>
                <EntryDate>
                  <span>
                    <DateIcon />
                  </span>
                  {readableDate}
                </EntryDate>
                <EntryCategories>
                  <span>
                    <TagIcon />
                  </span>
                  {entryCategories}
                </EntryCategories>
              </EntryDetails>
            </EntryMeta>
            <Link href={`/${entry.slug}`} passHref>
              <EntryContents isAlt={isAlt}>
                <h1>{entry.title}</h1>
                <h2>{readableDate}</h2>
                <p>{entry.preview}</p>
              </EntryContents>
            </Link>
          </Entry>
        </LazyLoadComponent>
      );
    });
  }, [setSelectedCategory, filteredEntries]);

  return (
    <>
      <Meta
        title="Writing - Evan Bonsignori"
        description="A blog covering life, tech, and music by Evan Bonsignori"
        keywords="Writing, Blog, Evan Bonsignori"
        image="https://evan-bio-assets.s3.amazonaws.com/blog-themed-pencil-icon.jpg"
        imageAlt="Pencil icon with colors matching the theme of the blog"
        type="blog"
      />
      <PageWrapper onScroll={onScroll}>
        <Header
          headerRef={headerRef}
          title="Writing"
          subtitle="by Evan Bonsignori"
          navLinks={[
            { url: process.env.PHOTOS_PAGE_URL, name: "Photography" },
            { url: process.env.ABOUT_PAGE_URL, name: "About Me" },
          ]}
          tags={[
            {
              pluralName: "tags",
              icon: <TagIcon />,
              multiple: false,
              options: categories,
              selected: selectedCategory,
              setSelected: setSelectedCategory,
              includeAll: true,
            },
          ]}
          search={{
            searchQuery,
            setSearchQuery,
          }}
          sortBy={{
            sortBy,
            setSortBy,
            options: sortByOpts,
          }}
          linkStyles={linkStyles}
        />
        <Entries ref={entriesRef}>{EntriesRender}</Entries>
        <Copyright />
      </PageWrapper>
    </>
  );
}

export async function getStaticProps() {
  const entries = fetchEntries();
  const categories = {};
  for (const entry of Object.values(entries)) {
    for (const category of entry.data.categories) {
      if (!categories[category]) {
        categories[category] = true;
      }
    }
  }
  const sortedEntries = Object.values(entries)
    .map((entry) => {
      // In production, only add to entries to index page if they are not a WIP post
      if (process.env.NODE_ENV === "production" && entry.data.isWip) {
        return null;
      }
      return {
        ...entry.data,
        date: entry.data.date.toString(),
      };
    })
    .filter((x) => x)
    .sort((a, b) => a.date > b.date);
  return {
    props: { entries: sortedEntries, categories: Object.keys(categories) },
  };
}

const PageWrapper = styled.div`
  position: relative;
  max-height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100vw;
  max-width: 100vw;
`;

const Entries = styled.div`
  margin: 0 24px;
`;

const EntryPhoto = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.2s;
  ${(props) => props.backgroundImage}
`;
const nestedIcon = `
  span {
    display: inline-flex;
    margin-right: 8px;
  }
  svg {
    fill: var(--background);
    width: 1rem;
  }
`;
const EntryDate = styled.li`
  display: flex;
  align-items: center;
  ${nestedIcon}
`;
const EntryCategories = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: auto;
  padding: 0;
  list-style: none;
  ${nestedIcon}
  li {
    display: inline-block;
    margin-right: 5px;
  }
  li:first-child {
    margin-left: -4px;
  }
  li a:hover {
    color: var(--primary);
  }
`;

const EntryDetails = styled.ul`
  max-height: 99%;
  list-style: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -100%;
  margin: auto;
  transition: left 0.2s;
  background: rgba(0, 0, 0, 0.7);
  color: var(--background);
  padding: 10px;
  width: 100%;
  font-size: 1.2rem;

  a {
    color: var(--background);
    text-decoration: underline;
  }

  @media (min-width: 640px) {
    ${(props) => props.isAlt && `padding-left: 25px;`}
  }
`;

const EntryProps = (props) =>
  props.isAlt &&
  `
    flex-direction: row-reverse;
`;
const Entry = styled.div`
  font-family: var(--main-family), sans-serif;
  * {
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  box-shadow: 0 3px 7px -1px rgba(0, 0, 0, 0.5);
  margin-bottom: 1.6%;
  background: var(--background);
  line-height: 1.4;
  font-family: sans-serif;
  border-radius: 5px;
  overflow: hidden;
  z-index: 0;

  :hover ${EntryPhoto} {
    transform: scale(1.3) rotate(3deg);
  }

  :hover ${EntryDetails} {
    left: 0%;
  }

  @media (min-width: 640px) {
    flex-direction: row;
    max-width: 700px;

    ${EntryProps}
  }
`;
const EntryMeta = styled.div`
  position: relative;
  z-index: 0;
  height: 200px;
  overflow: hidden;

  @media (min-width: 640px) {
    flex-basis: 40%;
    min-height: 200px;
    height: auto;
  }
`;

const EntryContentsProps = (props) =>
  props.isAlt &&
  `
      :before {
    left: inherit;
    right: -10px;
    transform: skew(3deg);
  }
  `;
const EntryContents = styled.div`
  background: var(--background);
  padding: 1rem;
  position: relative;
  z-index: 1;

  :hover {
    cursor: pointer;
    h1 {
      color: var(--primary);
    }
    p:first-of-type:before {
      background: var(--primary);
    }
  }

  h1 {
    line-height: 1;
    margin: 0;
    font-size: 1.7rem;
    color: var(--secondary);
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 300;
    color: var(font-secondary)
    margin-top: 5px;
  }

  p {
    position: relative;
    margin: 1rem 0 0;
  }
  p:first-of-type {
    margin-top: 1.25rem;
  }
  p:first-of-type:before {
    content: "";
    position: absolute;
    height: 5px;
    background: var(--secondary);
    width: 35px;
    top: -0.75rem;
    border-radius: 3px;
  }

  @media (min-width: 640px) {
    flex-basis: 60%;
    :before {
      transform: skewX(-3deg);
      content: "";
      background: var(--background);
      width: 30px;
      position: absolute;
      left: -10px;
      top: 0;
      bottom: 0;
      z-index: -1;
    }
    ${EntryContentsProps}
  }
`;
