import React from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import GithubIcon from "../svgs/social/github";
import GoodreadsIcon from "../svgs/social/goodreads";
import InstagramIcon from "../svgs/social/instagram";
import LastfmIcon from "../svgs/social/lastfm";
import LinkedinIcon from "../svgs/social/linkedin";

// Due to issues with styled components and Next.js, these can't be created dynamically
export default function SocialIcons({ content, className }) {
  const { socialLinks } = content;
  return (
    <IconsWrapper className={className}>
      <IconLink href={socialLinks.github}>
        <GithubIcon />
      </IconLink>
      <IconLink href={socialLinks.linkedin}>
        <LinkedinIcon />
      </IconLink>
      <IconLink href={socialLinks.instagram}>
        <InstagramIcon />
      </IconLink>
      <IconLink href={socialLinks.goodreads}>
        <GoodreadsIcon />
      </IconLink>
      <IconLink href={socialLinks.lastfm}>
        <LastfmIcon />
      </IconLink>
    </IconsWrapper>
  );
}

const IconsWrapperBreakpoints = setEachBreakpoint({
  xs: `
   position: relative;
   top: 0;
   left: 0;
  `,
  sm: `
   position: relative;
   top: 0;
   left: 0;
  `,
  md: `
  margin-right: .5rem;
  `,
  lg: `
  margin-right: 1rem;
  `,
  xl: `
  margin-right: 1rem;
  `,
  xxl: `
  margin-right: 1rem;
  `,
});

const IconsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 2rem;
  z-index: 2;
  right: 0;
  ${IconsWrapperBreakpoints}
`;

const IconLinkBreakpoints = setEachBreakpoint({
  xs: `
  margin: 0 .75rem;
  margin-bottom: 3%;
  svg {
    width: 2.35rem;
    height: 2.35rem;
  }
  `,
  sm: `
  margin: 0 .8rem;
  svg {
    width: 3rem;
    height: 3rem;
  }
  `,
  md: `
  margin: 0 .8rem;
  svg {
    width: 3.0rem;
    height: 3.0rem;
  }
  `,
  lg: `
  margin: 0 .8rem;
  svg {
    width: 3.0rem;
    height: 3.0rem;
  }
  `,
});
const IconLink = styled.a`
  margin-right: 2rem;
  svg {
    width: 3.2rem;
    height: 3.2rem;
    fill: white;
    :hover {
      fill: rgb(95, 145, 255);
    }
  }
  ${IconLinkBreakpoints}
`;
