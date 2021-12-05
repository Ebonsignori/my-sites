import Link from "next/link";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import RightArrow from "../svgs/right-arrow";

export default function SectionHeader({
  headerTitle,
  linkTitle,
  linkUrl,
  Icon,
}) {
  const StyledIcon = Icon ? getStyledIcon(Icon) : null;
  return (
    <AboutHeaderSection id={headerTitle}>
      <StyledIcon />
      <AboutHeaderTitle>{headerTitle}</AboutHeaderTitle>
      {linkUrl && (
        <Link href={linkUrl} passHref>
          <AboutHeaderLink>
            {linkTitle}
            <RightArrow />
          </AboutHeaderLink>
        </Link>
      )}
    </AboutHeaderSection>
  );
}

const AboutHeaderSectionSmall = `
  margin-top: .5em;
  margin-bottom: .5em;
  width: auto;
`;
const AboutHeaderSectionBreakpoints = setEachBreakpoint({
  xs: AboutHeaderSectionSmall,
  sm: AboutHeaderSectionSmall,
  md: AboutHeaderSectionSmall,
});
const AboutHeaderSection = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  border-bottom: 1px solid #e1e1e1;
  ${AboutHeaderSectionBreakpoints}
`;

const StyledIconBreakpoints = setEachBreakpoint({
  xs: `
  width: 2em;
  margin-right: 1em;
  `,
});

function getStyledIcon(Icon) {
  return styled(Icon)`
    width: 3em;
    margin-right: 1.4em;
    ${StyledIconBreakpoints}
  `;
}

const AboutHeaderTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.6em;
  line-height: 1.3em;
  `,
  sm: `
  font-size: 2em;
  line-height: 1.6em;
  `,
  md: `
  font-size: 2.2em;
  line-height: 1.6em;
  `,
  xl: `
  font-size: 2em;
  `,
  xxl: `
  font-size: 2.1em;
  `,
});
const AboutHeaderTitle = styled.h2`
  display: flex;
  flex-direction: row;
  font-size: 1.8em;
  line-height: 1.8em;
  margin: 0;
  ${AboutHeaderTitleBreakpoints}
`;

const AboutHeaderResumeLinkDefaults = `
  svg {
    width: 2em;
    margin-left: 1em;
  }
`;
const AboutHeaderResumeLinkBreakpoints = setEachBreakpoint({
  xs: `
   svg {
    width: 1.2em;
    margin-left: .5em;
   }
  `,
  sm: AboutHeaderResumeLinkDefaults,
  md: AboutHeaderResumeLinkDefaults,
  lg: AboutHeaderResumeLinkDefaults,
  xl: AboutHeaderResumeLinkDefaults,
  xxl: AboutHeaderResumeLinkDefaults,
});

const AboutHeaderLink = styled.a`
  display: flex;
  align-items: center;
  color: #272727;
  margin-left: auto;
  line-height: 1em;
  white-space: nowrap;
  text-decoration: none;
  ${AboutHeaderResumeLinkBreakpoints}

  :hover {
    cursor: pointer;
    color: rgb(95, 145, 255);
    svg {
      fill: rgb(95, 145, 255);
    }
  }
`;
