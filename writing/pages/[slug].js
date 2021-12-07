import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import styled from "styled-components";

import { isValidDate, toReadableDateString } from "../../shared/utils/dates";
import { fetchEntries, getEntryBySlug } from "../src/utils/fetch-entries";

const components = {
  Heading: styled.h2`
    color: red;
  `,
};

export default function Post({ source, metadata }) {
  return (
    <PageWrapper>
      <h1>{metadata.title}</h1>
      <h2>{metadata.date}</h2>
      <MDXRemote {...source} components={components} />
    </PageWrapper>
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

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  color: black;
`;
