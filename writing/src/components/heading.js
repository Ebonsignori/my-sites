import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import { linkStyles } from "../../src/utils/global-styles";

export const HeadingContentBreakpoints = setEachBreakpoint({
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
export const HeadingContent = styled.div`
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
export const TitleWrapper = styled.div`
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
export const Title = styled.h1`
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
export const SubTitle = styled.h2`
  color: var(--secondary);
  margin: 0;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1em;
  margin-left: 0.5em;
  ${SubTitleBreakpoints}
`;

export const AboutLink = styled.a`
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
export const SubHeadingContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1em;
  grid-column: 2;
  grid-row: 1;
  ${SubHeadingContentBreakpoints}
`;
