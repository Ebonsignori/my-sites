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
    <SectionHeaderContainer>
      <SectionHeaderWrapper id={headerTitle}>
        <StyledIcon />
        <HeaderTitle>{headerTitle}</HeaderTitle>
        {linkUrl && (
          <Link href={linkUrl} passHref>
            <CTALink>
              {linkTitle}
              <RightArrow />
            </CTALink>
          </Link>
        )}
      </SectionHeaderWrapper>
    </SectionHeaderContainer>
  );
}

const SectionHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 24px;
`;
const SectionHeaderSmallBreakpoints = `
  margin-top: 3rem;
`;
const SectionHeaderLargeBreakpoints = `
  width: 1360px;
  max-width: 1360px;
`;
const SectionHeaderBreakpoints = setEachBreakpoint({
  xs: SectionHeaderSmallBreakpoints,
  sm: SectionHeaderSmallBreakpoints,
  md: SectionHeaderSmallBreakpoints,
  lg: SectionHeaderLargeBreakpoints,
  xl: SectionHeaderLargeBreakpoints,
  xxl: SectionHeaderLargeBreakpoints,
});
const SectionHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  max-width: 680px;
  width: 680px;
  max-width: 100%;
  display: flex;
  border-bottom: 2px solid #e1e1e1;
  margin-top: 3rem;
  ${SectionHeaderBreakpoints}
`;

const StyledIconBreakpoints = setEachBreakpoint({
  xs: `
  width: 2.0rem;
  height: 2.0rem;
  `,
  sm: `
  width: 4.0rem;
  height: 4.0rem;
  `,
  md: `
  width: 4.0rem
  height: 4.0rem
  `,
  lg: `
  width: 4.0rem;
  height: 4.0rem;
  margin-right: 2rem;
  `,
  xl: `
  width: 4rem;
  height: 4rem;
  margin-right: 2rem;
  `,
  xxl: `
  width: 4.4rem;
  height: 4.4rem;
  margin-right: 2rem;
  `,
});

function getStyledIcon(Icon) {
  return styled(Icon)`
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 1rem;
    ${StyledIconBreakpoints}
  `;
}

const HeaderTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 2.0rem;
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
  font-size: 4rem;
  `,
  xxl: `
  font-size: 4.4rem;
  `,
});
const HeaderTitle = styled.h2`
  display: flex;
  flex-direction: row;
  line-height: 1.2em;
  margin: 0;
  ${HeaderTitleBreakpoints}
`;

const CTALinkDefaults = `
  svg {
    width: 2.5rem;
    height: 2.5rem;
    margin-left: .5rem;
  }
`;
const CTALinkBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.0rem;
   svg {
    min-width: 1.2rem;
    min-height: 1.2rem;
    width: 1.2rem;
    height: 1.2rem;
    margin-left: .2rem;
   }
  `,
  sm: CTALinkDefaults,
  md: CTALinkDefaults,
  lg: CTALinkDefaults,
  xl: CTALinkDefaults,
  xxl: CTALinkDefaults,
});

const CTALink = styled.a`
  display: flex;
  align-items: center;
  color: #272727;
  margin-left: auto;
  font-size: 1.5rem;
  line-height: 1em;
  white-space: nowrap;
  text-decoration: none;
  ${CTALinkBreakpoints}

  :hover {
    cursor: pointer;
    color: rgb(95, 145, 255);
    svg {
      fill: rgb(95, 145, 255);
    }
  }
`;
