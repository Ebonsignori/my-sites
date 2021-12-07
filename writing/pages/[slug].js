import Head from "next/head";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import styled from "styled-components";

import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import { isValidDate, toReadableDateString } from "../../shared/utils/dates";
import { capitalizeAll } from "../../shared/utils/strings";
import {
  AboutLink,
  HeadingContent,
  SubHeadingContent,
  SubTitle,
  Title,
  TitleWrapper,
} from "../src/components/heading";
import { fetchEntries, getEntryBySlug } from "../src/utils/fetch-entries";

const components = {
  Heading: styled.h2`
    color: red;
  `,
};

export default function Post({ source, metadata }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.preview} />
        <meta property="og:title" content={metadata.title} />
      </Head>
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
                <PostDate>{metadata.date}</PostDate>&nbsp;|&nbsp;
                <Link href={`/#${metadata.category.toLowerCase()}`} passHref>
                  <PostCategory>{metadata.category}</PostCategory>
                </Link>
              </SubPostTitle>
            </PostHeader>
          </SubHeadingContent>
        </HeadingContent>
        <MainContentWrapper>
          <MDXRemote {...source} components={components} />
        </MainContentWrapper>
      </PageWrapper>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const entry = getEntryBySlug(slug);
  const mdxSource = await serialize(entry.content);
  delete entry.content;
  if (isValidDate(entry.data.date)) {
    entry.data.date = toReadableDateString(entry.data.date);
  }
  entry.data.category = capitalizeAll(entry.data.category);
  return { props: { source: mdxSource, metadata: entry.data } };
}

export async function getStaticPaths() {
  const entries = fetchEntries();

  return {
    paths: Object.values(entries).map((entry) => {
      return {
        params: {
          // Explicit for clarity
          slug: entry.data.slug,
        },
      };
    }),
    fallback: false,
  };
}

const PageWrapper = styled.div``;

const MainContentWrapper = styled.div`
  background-color: var(--background);
  color: var(--font);
  word-wrap: break-word;
  margin: 0 auto;
  padding: 1.5em;

  @media (min-width: 768px) {
    font-size: 125%;
    max-width: 42em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2.5rem 0 1.5rem 0;
    line-height: 1.25;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
  }
  p code {
    background-color: #eee;
    padding: 0.05em 0.2em;
    border: 1px solid #ccc;
  }

  ol,
  ul {
    margin: 1em;
  }
  ol li ol,
  ol li ul,
  ul li ol,
  ul li ul {
    margin: 0 2em;
  }
  ol li p,
  ul li p {
    margin: 0;
  }

  dl {
    font-family: monospace, monospace;
  }
  dl dt {
    font-weight: bold;
  }
  dl dd {
    margin: -1em 0 1em 1em;
  }

  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    padding: 0.5em;
  }

  blockquote {
    padding-left: 1em;
    font-style: italic;
    border-left: solid 1px #fa6432;
  }

  table {
    font-size: 1rem;
    text-align: left;
    caption-side: bottom;
    margin-bottom: 2em;
  }
  table * {
    border: none;
  }
  table thead,
  table tr {
    display: table;
    table-layout: fixed;
    width: 100%;
  }
  table tr:nth-child(even) {
    background-color: rgba(200, 200, 200, 0.2);
  }
  table tbody {
    display: block;
    max-height: 70vh;
    overflow-y: auto;
  }
  table td,
  table th {
    padding: 0.25em;
  }

  pre {
    max-height: 70vh;
    margin: 1em 0;
    padding: 1em;
    overflow: auto;
    font-size: 0.85rem;
    font-family: monospace, monospace;
    background: var(--background-accent);
  }
`;

const StyledTitleWrapper = styled(TitleWrapper)`
  :hover {
    cursor: pointer;
    color: var(--secondary);
  }
`;

const PostHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PostTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 3.75rem;
  `,
  sm: `
  font-size: 5rem;
  `,
  md: `
  font-size: 3rem;
  `,
  lg: `
  font-size: 2.5rem;
  `,
  xl: `
  font-size: 3.0rem;
  `,
  xxl: `
  font-size: 3.5rem;
  `,
});
const PostTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--font);
  ${PostTitleBreakpoints}
`;
const SubPostTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.5rem;
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
  ${SubPostTitleBreakpoints}
`;
const PostDate = styled.div`
  font-weight: 100;
  color: var(--font-secondary);
`;
const PostCategory = styled.div`
  font-weight: 100;
  color: var(--secondary);
`;
