import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useState } from "react";
import emoji from "remark-emoji";
import styled from "styled-components";

import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import { isValidDate, toReadableDateString } from "../../shared/utils/dates";
import { capitalizeAll } from "../../shared/utils/strings";
import Figure from "../src/components/figure";
import {
  AboutLink,
  HeadingContent,
  SubHeadingContent,
  SubTitle,
  Title,
  TitleWrapper,
} from "../src/components/heading";
import Meta from "../src/components/meta";
import Modal from "../src/components/modal";
import ShareLinks from "../src/components/share-links";
import Tooltip from "../src/components/tooltip";
import LeftArrow from "../src/svgs/left-arrow";
import RightArrow from "../src/svgs/right-arrow";
import AppContext from "../src/utils/app-context";
import { fetchEntries, getEntryBySlug } from "../src/utils/fetch-entries";
import { linkStyles } from "../src/utils/global-styles";

const components = {
  Figure,
  Tooltip,
};

export default function Post({ source, metadata, prev, next }) {
  const [modalContents, setModalContents] = useState(undefined);
  const appState = {
    modalContents,
    setModalContents,
  };
  const categories = metadata.categories.map((category, index) => {
    return (
      <Link key={category} href={`/#${category.toLowerCase()}`} passHref>
        <PostCategory>
          {capitalizeAll(category)}
          {index !== categories.length - 1 ? ", " : ""}
        </PostCategory>
      </Link>
    );
  });
  let wipRender = null;
  if (metadata.isWip) {
    wipRender = (
      <>
        {" "}
        &nbsp;|&nbsp; <span style={{ color: "red" }}>WIP</span>{" "}
      </>
    );
  }
  return (
    <>
      <Meta
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        image={metadata.image}
        imageAlt={metadata.imageAlt}
      />
      <AppContext.Provider value={appState}>
        <Modal modalContents={modalContents} />
        <PageWrapper>
          <HeadingContent>
            <Link href="/" passHref>
              <StyledTitleWrapper>
                <Title>Writing</Title>
                <SubTitle>by Evan Bonsignori</SubTitle>
              </StyledTitleWrapper>
            </Link>
            <AboutLink href={process.env.ABOUT_PAGE_URL}>About</AboutLink>
            <SubHeadingContent>
              <PostHeader>
                <PostTitle>{metadata.title}</PostTitle>
                <SubPostTitle>
                  {categories}
                  &nbsp; | &nbsp;
                  <PostDate>{metadata.date}</PostDate>
                  {wipRender}
                </SubPostTitle>
                <ShareLinks slug={metadata.slug} />
              </PostHeader>
            </SubHeadingContent>
          </HeadingContent>
          <MainContentContainer>
            <MainContent>
              <Figure
                image={metadata.image}
                imageAlt={metadata.imageAlt}
                caption={metadata.imageCaption}
                priority
              />
              <MDXRemote {...source} components={components} />
              <hr />
              <BottomHeading>More Reads</BottomHeading>
              <BottomCTA href={process.env.ABOUT_PAGE_URL}>
                About Author
              </BottomCTA>
              <PrevNextOpts>
                {prev?.data && (
                  <Link href={`/${prev.data.slug}`} passHref>
                    <Prev>
                      <LeftArrow />
                      <h5>{prev.data.title}</h5>
                    </Prev>
                  </Link>
                )}
                {next?.data && (
                  <Link href={`/${next.data.slug}`} passHref>
                    <Next>
                      <h5>{next.data.title}</h5>
                      <RightArrow />
                    </Next>
                  </Link>
                )}
              </PrevNextOpts>
            </MainContent>
          </MainContentContainer>
        </PageWrapper>
      </AppContext.Provider>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const entries = getEntryBySlug(slug);
  const mdxSource = await serialize(entries.current.content, {
    mdxOptions: {
      remarkPlugins: [emoji],
    },
  });
  for (const entry of Object.values(entries)) {
    delete entry.content;
    if (isValidDate(entry.data.date)) {
      entry.data.date = toReadableDateString(entry.data.date);
    }
  }
  const { current, prev = {}, next = {} } = entries;
  return { props: { source: mdxSource, metadata: current.data, prev, next } };
}

export async function getStaticPaths() {
  const entries = fetchEntries();

  return {
    paths: Object.values(entries).map((entry) => {
      return {
        params: {
          slug: entry.data.slug,
        },
      };
    }),
    fallback: false,
  };
}

const PageWrapper = styled.div`
  max-width: 100vw;
  overflow: hidden;
`;

const MainContentContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const MainContentBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 18px;
  line-height: 28px;

  p, figure {
    margin-top: 1.4rem;
  }
  figcaption {
    font-size: 16px;
  }
  `,
  sm: `
  font-size: 21px;
  line-height: 33px;

  p, figure {
    margin-top: 1.7rem;
  }
  figcaption {
    font-size: 18px;
  }
  `,
  md: `
  font-size: 21px;
  line-height: 33px;

  p, figure {
    margin-top: 1.7rem;
  }
  `,
  lg: `
  font-size: 21px;
  line-height: 33px;

  p, figure {
    margin-top: 1.7rem;
  }
  `,
  xl: `
  max-width: 1200px;
  font-size: 36px;
  line-height: 56px;

  p, figure {
    margin-top: 1.7rem;
  }
  `,
  xxl: `
  max-width: 1200px;
  font-size: 36px;
  line-height: 56px;

  p, figure {
    margin-top: 1.8rem;
  }
  `,
});
const MainContent = styled.section`
  background-color: var(--background);
  color: var(--font);
  word-wrap: break-word;
  max-width: 680px;
  margin: 0 24px;
  ${MainContentBreakpoints}

  p {
    margin-bottom: 0;
  }

  blockquote {
    padding-left: 1em;
    font-style: italic;
    border-left: solid 1px var(--primary);
  }

  pre {
    max-height: 70vh;
    margin: 1em 0;
    padding: 1em;
    overflow: auto;
    font-family: monospace, monospace;
    background: var(--background-accent);
  }

  sup {
    position: relative;
    line-height: normal;
    margin-left: 0.1em;
  }

  hr {
    margin: 2em 0;
  }

  .footnotes {
    .footnote-backref {
      margin-left: 0.5rem;
    }
    ol {
      color: var(--font-secondary);
    }
  }
`;

const StyledTitleWrapper = styled(TitleWrapper)`
  :hover {
    cursor: pointer;
    color: var(--secondary);
  }
`;

const PostHeaderBreakpoints = setEachBreakpoint({
  xs: `
  margin: 0;
  `,
  xl: `
  max-width: 1200px;
  width: 1200px;
  `,
  xxl: `
  max-width: 1200px;
  width: 1200px;
  `,
});
const PostHeader = styled.div`
  max-width: 680px;
  width: 680px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin: 0 24px;
  ${PostHeaderBreakpoints}
`;

const PostTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 3.0rem;
  `,
  sm: `
  font-size: 4.0rem;
  `,
  md: `
  font-size: 4.0rem;
  `,
  lg: `
  font-size: 4.0rem;
  `,
  xl: `
  font-size: 6rem;
  `,
  xxl: `
  font-size: 6.4rem;
  `,
});
const PostTitle = styled.h2`
  margin: 0;
  font-size: 5rem;
  font-weight: 900;
  color: var(--font);
  margin-bottom: 0.15em;
  ${PostTitleBreakpoints}
`;
const SubPostTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.3rem;
  margin-left: .1em;
  `,
  sm: `
  font-size: 1.75rem;
  `,
  md: `
  font-size: 1.6rem;
  `,
  lg: `
  font-size: 1.5rem;
  `,
  xl: `
  font-size: 1.75rem;
  `,
  xxl: `
  font-size: 2rem;
  `,
});
const SubPostTitle = styled.div`
  display: flex;
  flex-direction: row;
  color: var(--font-secondary);
  font-weight: 100;
  ${SubPostTitleBreakpoints}
`;
const PostDate = styled.div``;
const PostCategory = styled.div`
  font-weight: 500 !important;
  ${linkStyles}
`;

const BottomHeading = styled.h4`
  font-size: larger;
  margin: 0;
  margin-top: 1em;
  text-align: center;
`;
const BottomCTA = styled.a`
  display: block;
  width: 100%;
  margin-bottom: 0.5em;
  text-align: center;
`;

const PrevNextOpts = styled.div`
  display: flex;
  flex-direction: row;

  :hover {
    svg {
      fill: var(--secondary);
    }
  }

  svg {
    width: 2em;
    margin: 0 0.3em;
    fill: var(--primary);
  }

  h5 {
    margin: 0;
  }

  margin-bottom: 1em;
`;

const Prev = styled.a`
  width: 45%;
  display: flex;
  align-items: center;
  text-align: left;
`;
const Next = styled.a`
  width: 45%;
  display: flex;
  align-items: center;
  margin-left: auto;
  text-align: right;
`;
