import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";

const SectionBreakpoints = setEachBreakpoint({
  xs: `
  padding-left: 5vw;
  padding-right: 5vw;
  `,
  sm: `
  padding-left: 5vw;
  padding-right: 5vw;
  `,
  md: `
  padding-left: 5vw;
  padding-right: 5vw;
  `,
  lg: `
  padding-left: 15vw;
  padding-right: 15vw;
  `,
  xl: `
  padding-left: 20vw;
  padding-right: 20vw;
  `,
  xxl: `
  padding-left: 25vw;
  padding-right: 25vw;
  `,
});
export const SectionWrapper = styled.div`
  display: block;
  padding-top: 5%;
  padding-left: 5vw;
  padding-right: 5vw;
  justify-content: center;
  align-items: center;
  background-color: white;
  position: relative;
  overflow: hidden;
  z-index: 2;
  font-family: "Helvetica Now", sans-serif;
  ${SectionBreakpoints}
  :last-of-type {
    padding-bottom: 50px;
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
  ${ContentSectionBreakpoints}
`;

const LeftContentSectionBreakpoints = setEachBreakpoint({
  xs: `
  padding: 0;
  width: 90%;
  font-size: .8em;
  p {
    line-height: 1.5em !important;
  }
`,
  sm: `
  padding: 0;
  width: 80%;
  font-size: 1.2em;
  p {
    line-height: 1.4em !important;
  }
`,
  md: `
  padding: 0;
  width: 73%;
  font-size: 1.3em;
  p {
    line-height: 1.4em !important;
  }
`,
  lg: `
  font-size: 1.1em;
  p {
    line-height: 1.3em !important;
  }
  `,
  xl: `
  font-size: 1.1em;
  p {
    line-height: 1.3em !important;
  }
  `,
  xxl: `
  font-size: 1.2em;
  p {
    line-height: 1.3em !important;
  }
  `,
});
export const LeftContentSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-right: 5%;
  ${LeftContentSectionBreakpoints}
`;

export const SectionText = styled.p`
  font-weight: 300;
  margin: 0;
  line-height: 1.3em;
  font-size: 1.2em;

  span {
    z-index: 2;
    :hover {
      cursor: pointer;
    }
  }
  button {
    background-color: white;
    color: black;
    border-radius: 15px;
    padding: 4px;
    vertical-align: middle;
    border: 1px solid black;
    z-index: 2;
    :hover {
      cursor: pointer;
      background-color: red;
    }
  }

  svg {
    vertical-align: middle;
    width: 1.7em;
    ${(props) =>
  !props.isOn &&
      `
    path:nth-of-type(2) {
      fill: #e8ac17;
    }
    `}
  }
`;

const SectionTextCenterBreakpoints = setEachBreakpoint({
  xs: `
    width: 90%;
    font-size: 1.1em;
    line-height: 1.4em;
  `,
  sm: `
    font-size: 1.3em;
    line-height: 1.4em;
  `,
});
export const SectionTextCenter = styled(SectionText)`
  font-weight: 300;
  margin: 0;
  padding-top: 1em;
  font-size: 1.5em;
  line-height: 1.6em;
  ${SectionTextCenterBreakpoints}

  a {
    color: black;
    :hover {
      color: rgb(95, 145, 255);
    }
  }
`;

const RightContentSectionBreakpoints = setEachBreakpoint({
  xs: `
  padding: 0;
  width: 90%;
  font-size: .9em;
  p {
    line-height: 1.4em !important;
  }
`,
  sm: `
  padding: 0;
  width: 80%;
  font-size: 1.2em;
  p {
    line-height: 1.4em !important;
  }
`,
  md: `
  padding: 0;
  width: 73%;
  font-size: 1.2em;
`,
  lg: `
  font-size: 1.1em;
  `,
  xl: `
  font-size: 1.1em;
  `,
  xxl: `
  font-size: 1.2em;
  p {
    line-height: 1.4em !important;
  }
  `,
});

export const RightContentSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-left: 5%;
  ${RightContentSectionBreakpoints}
`;
