import styled from "styled-components";

import {
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
  setEachBreakpoint,
} from "../../../shared/utils/breakpoints";

const TextContentBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 18px;
  line-height: 28px;

  p {
    margin-top: 1.4rem;
  }
  `,
});
const TextContentProps = (props) =>
  props.wide &&
  `
  ${BREAKPOINT_LG} {
    max-width: 1200px;
    width: 1200px;
  }
  ${BREAKPOINT_XL} {
    max-width: 1200px;
    width: 1200px;
  }
  ${BREAKPOINT_XXL} {
    max-width: 1200px;
    width: 1200px;
  }
`;
export const TextContent = styled.div`
  font-family: var(--body-family), sans-serif;
  background-color: var(--font);
  color: var(--background);
  word-wrap: break-word;
  max-width: 680px;
  margin: 0 24px;
  font-size: 21px;
  line-height: 33px;

  p {
    margin-top: 1.7rem;
    margin-bottom: 0;
  }
  ${TextContentBreakpoints}
  ${TextContentProps}
`;

export const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: var(--font);
  position: relative;
  overflow: hidden;
  z-index: 2;
  :last-of-type {
    padding-bottom: 25px;
  }
`;

const ContentSectionSmall = `
  flex-direction: column;
  align-items: center;
`;
const ContentSectionBreakpoints = setEachBreakpoint({
  xs: ContentSectionSmall,
  sm: ContentSectionSmall,
  md: ContentSectionSmall,
});
export const ContentSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  ${ContentSectionBreakpoints}
`;

export const SectionText = styled.p`
  font-weight: 300;
  margin: 0;

  span {
    z-index: 2;
    :hover {
      cursor: pointer;
    }
  }
`;

const RightContentSectionBreakpoints = (props) =>
  setEachBreakpoint({
    xs: `
  ${props.hideOnMobile ? "display: none;" : ""}
  padding: 0;
  word-wrap: break-word;
  max-width: 680px;
  width: 680px;
  margin: 0 24px;
  font-size: .9em;
  p {
    line-height: 1.4em !important;
  }
`,
    sm: `
  ${props.hideOnMobile ? "display: none;" : ""}
  padding: 0;
  word-wrap: break-word;
  max-width: 680px;
  width: 680px;
  margin: 0 24px;
  font-size: 1.2em;
  p {
    line-height: 1.4em !important;
  }
`,
    md: `
  ${props.hideOnMobile ? "display: none;" : ""}
  padding: 0;
  word-wrap: break-word;
  width: 680px;
  max-width: 680px;
  margin: 0 24px;
  font-size: 1.2em;
`,
    lg: `
  font-size: 1.1em;
  `,
    xl: `
  font-size: 1.1em;
  padding-left: 8%;
  `,
    xxl: `
  font-size: 1.2em;
  p {
    line-height: 1.4em !important;
  }
  padding-left: 8%;
  `,
  });

export const RightContentSection = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 2%;
  ${RightContentSectionBreakpoints}
`;
