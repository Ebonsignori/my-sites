import React from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import GithubIcon from "../svgs/social/github";
import GoodreadsIcon from "../svgs/social/goodreads";
import InstagramIcon from "../svgs/social/instagram";
import LastfmIcon from "../svgs/social/lastfm";
import LinkedinIcon from "../svgs/social/linkedin";

const NUMBER_OF_LINKS = 5;

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
      <IconLink href={socialLinks.goodreads}>
        <GoodreadsIcon />
      </IconLink>
      <IconLink href={socialLinks.instagram}>
        <InstagramIcon />
      </IconLink>
      <IconLink href={socialLinks.lastfm}>
        <LastfmIcon />
      </IconLink>
    </IconsWrapper>
  );
}

const getLinkOffset = (margin, width) =>
  Math.abs(100 - (NUMBER_OF_LINKS * margin + NUMBER_OF_LINKS * width)) - 1;
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
    left: ${getLinkOffset(2, 4.0)}vw;
  `,
  lg: `
    left: ${getLinkOffset(1.0, 3.0)}vw;
  `,
});

const IconsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 2vh;
  left: ${getLinkOffset(1.0, 2.0)}vw;
  z-index: 2;
  ${IconsWrapperBreakpoints}
`;

const IconLinkBreakpoints = setEachBreakpoint({
  xs: `
  margin-bottom: 3%;
  margin-right: 3.2vw;
  svg {
    width: 8.2vw;
  }
  `,
  sm: `
  margin-right: 2.2vw;
  svg {
    width: 5vw;
  }
  `,
  md: `
  margin-right: 2vw;
  svg {
    width: 4.0vw;
  }
  `,
  lg: `
  margin-right: 1.0vw;
  svg {
    width: 3.0vw;
  }
  `,
});
const IconLink = styled.a`
  margin-right: 1vw;
  svg {
    width: 2vw;
    height: auto;
    fill: white;
    :hover {
      fill: rgb(95, 145, 255);
    }
  }
  ${IconLinkBreakpoints}
`;
