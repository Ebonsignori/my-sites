import copy from "copy-to-clipboard";
import React, { useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import FacebookIcon from "../svgs/facebook";
import LinkIcon from "../svgs/link-icon";
import LinkedinIcon from "../svgs/linkedin";
import TwitterIcon from "../svgs/twitter";

// Due to issues with styled components and Next.js, these can't be created dynamically
export default function ShareIcons({ className, slug }) {
  const url = `${process.env.WRITING_PAGE_URL}/${slug}`;
  const [copied, setCopied] = useState(false);
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${url}`,
    facebook: `https://www.facebook.com/dialog/feed?app_id=${process.env.FACEBOOK_APP_ID}&link=${url}&redirect_uri=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  };
  return (
    <IconsWrapper className={className}>
      <IconLink
        title="Share to Twitter"
        href={socialLinks.twitter}
        color="#00acee"
        className="tooltip"
      >
        <span className="tooltip-text">Share to Twitter</span>
        <TwitterIcon />
      </IconLink>
      <IconLink href={socialLinks.linkedin} color="#0e76a8" className="tooltip">
        <span className="tooltip-text">Share to Linkedin</span>
        <LinkedinIcon />
      </IconLink>
      <IconLink href={socialLinks.facebook} color="#3b5998" className="tooltip">
        <span className="tooltip-text">Share to Facebook</span>
        <FacebookIcon />
      </IconLink>
      <IconLink
        onClick={() => {
          copy(url);
          setCopied(true);
        }}
        onMouseLeave={() => {
          if (copied) {
            setTimeout(() => setCopied(false), 300);
          }
        }}
        color="var(--primary)"
        className="tooltip"
      >
        <span className="tooltip-text">
          {copied ? "Copied!" : "Copy to Clipboard"}
        </span>
        <LinkIcon />
      </IconLink>
    </IconsWrapper>
  );
}

const IconsWrapper = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
`;

const IconLinkBreakpoints = setEachBreakpoint({
  xs: `
  margin: 0 2vw;
  margin-bottom: 1%;
  svg {
    width: 5.2vw;
  }
  `,
  sm: `
  margin: 0 1.1vw;
  svg {
    width: 4vw;
  }
  `,
  md: `
  margin: 0 1vw;
  svg {
    width: 3.0vw;
  }
  `,
  lg: `
  svg {
    width: 2.0vw;
  }
  `,
  xxl: `
  svg {
    width: 1.5vw;
  }
  `,
});
const IconLink = styled.a`
  margin-right: 1vw;
  svg {
    width: 1.7vw;
    height: auto;
    fill: var(--font);
    :hover {
      fill: ${(props) => props.color};
    }
  }
  ${IconLinkBreakpoints}
`;
