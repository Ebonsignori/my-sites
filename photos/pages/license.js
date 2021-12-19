import styled from "styled-components";

import Copyright from "../../shared/components/copyright";
import Header from "../../shared/components/header";
import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import Meta from "../src/components/meta";
import CheckIcon from "../src/svgs/check-icon";
import XIcon from "../src/svgs/x-icon";

export default function License() {
  return (
    <>
      <Meta
        title="Photo License"
        description="All photos on this site are free to use without attribution or payment"
        keywords="License, Policy, Attribution"
        image="https://evan-bio-assets.s3.amazonaws.com/blog-themed-pencil-icon.jpg"
        imageAlt="Pencil icon with colors matching the theme of the blog"
      />
      <PageWrapper>
        <Header
          title="Photos"
          titleUrl={"/"}
          subtitle="by Evan Bonsignori"
          navLinks={[
            { url: "/license", name: "License", active: true },
            { url: "/photo-map", name: "Photo Map" },
            { url: process.env.WRITING_PAGE_URL, name: "Blog" },
            { url: process.env.ABOUT_PAGE_URL, name: "About Me" },
          ]}
        />
        <MainContentContainer>
          <MainContent>
            <h1>License</h1>
            <p>
              Original downloads of full-sized images are available on this
              site,
            </p>
            <UsageList>
              <li>
                <CheckIcon />
                All Photos can be <strong>downloaded</strong> and used for{" "}
                <strong>free</strong>
              </li>
              <li>
                <CheckIcon />
                For <strong>commercial</strong> and{" "}
                <strong>non-commercial</strong> purposes
              </li>
              <li>
                <CheckIcon />
                <strong>No permission or attribution</strong> required{" "}
              </li>
            </UsageList>
            <p>
              However, you <strong>can not</strong>,
            </p>
            <NoUsageList>
              <li>
                <XIcon />
                <strong>Sell</strong> any photo found here without{" "}
                <em>significant</em> modification
              </li>
            </NoUsageList>
            <hr />
            <p>
              If you feel like you need to pay for using them, feel free to
              donate to the following charities.
            </p>
            <br />
            Help save the planet we live on,
            <ul>
              <li>
                <a href="https://www.catf.us/">Clean Air Task Force</a>
              </li>
              <li>
                <a href="https://carbon180.org/">Carbon180</a>
              </li>
              <li>
                <a href="https://rainforestfoundation.org/">
                  Rainforest Foundation
                </a>
              </li>
            </ul>
            Help put a stop to injustice and inequality,
            <ul>
              <li>
                <a href="https://www.aclu.org/">ACLU</a>
              </li>
              <li>
                <a href="https://naacp.org/">NAACP</a>
              </li>
            </ul>
            Help people in other countries achieve a better standard of living,
            <ul>
              <li>
                <a href="https://www.heifer.org/">Heifer International</a>
              </li>
            </ul>
          </MainContent>
        </MainContentContainer>
        <Copyright />
      </PageWrapper>
    </>
  );
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

  p {
    margin-top: 1.4rem;
  }
  `,
  sm: `
  font-size: 21px;
  line-height: 33px;

  p {
    margin-top: 1.7rem;
  }
  `,
  md: `
  font-size: 21px;
  line-height: 33px;

  p {
    margin-top: 1.7rem;
  }
  `,
  lg: `
  font-size: 21px;
  line-height: 33px;

  p {
    margin-top: 1.7rem;
  }
  `,
  xl: `
  max-width: 1200px;
  font-size: 36px;
  line-height: 56px;

  p {
    margin-top: 1.7rem;
  }
  `,
  xxl: `
  max-width: 1200px;
  font-size: 36px;
  line-height: 56px;

  p {
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

  p {
    margin-bottom: 0;
  }

  hr {
    margin: 2em 0;
  }

  ${MainContentBreakpoints}
`;

const UsageListBreakpoints = setEachBreakpoint({
  xs: `
  svg {
    width: 32px;
  }
  `,
  sm: `
  svg {
    width: 33px;
  }
  `,
  md: `
  svg {
    width: 33px;
  }
  `,
  lg: `
  svg {
    width: 33px;
  }
  `,
  xl: `
  svg {
    width: 53px;
  }
  `,
  xxl: `
  svg {
    width: 53px;
  }
  `,
});
const UsageList = styled.ul`
  svg {
    fill: green;
    vertical-align: bottom;
    width: 1.7rem;
    margin-right: 10px;
  }
  padding: 0.8rem;
  list-style: none;
  p {
    display: inline-block;
  }
  ${UsageListBreakpoints}
`;

const NoUsageList = styled(UsageList)`
  svg {
    fill: red;
  }
`;
