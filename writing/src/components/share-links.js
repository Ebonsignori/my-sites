import copy from "copy-to-clipboard";
import React, { useState } from "react";
import styled from "styled-components";

import Tooltip from "../../../shared/components/tooltip";
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
      <Tooltip
        key="twitter"
        title="Share to Twitter"
        linkUrl={socialLinks.twitter}
        color="#00acee"
        text="Share to Twitter"
      >
        <TwitterIcon />
      </Tooltip>
      <Tooltip
        key="linkedin"
        linkUrl={socialLinks.linkedin}
        color="#0e76a8"
        text="Share to Linkedin"
      >
        <LinkedinIcon />
      </Tooltip>
      <Tooltip
        key="facebook"
        linkUrl={socialLinks.facebook}
        color="#3b5998"
        text="Share to Facebook"
      >
        <FacebookIcon />
      </Tooltip>
      <Tooltip
        key="clipboard"
        linkOnClick={() => {
          copy(url);
          setCopied(true);
        }}
        onMouseLeave={() => {
          if (copied) {
            setTimeout(() => setCopied(false), 300);
          }
        }}
        color="var(--primary)"
        linkUrl=""
        className="tooltip"
        text={copied ? "Copied!" : "Copy to Clipboard"}
      >
        <LinkIcon />
      </Tooltip>
    </IconsWrapper>
  );
}

const IconsWrapper = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
`;
