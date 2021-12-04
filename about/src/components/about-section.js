/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import LaptopIcon from "../svgs/laptop";
import RightArrow from "../svgs/right-arrow";
import RingIcon from "../svgs/ring";
import processEyeOfSauron from "./eye-of-sauron";

let audioPlaying = false;
let audio;

export default function AboutSection({ content, innerRef }) {
  const eyeOfSauronRef = useRef(null);
  const [showEye, setShowEye] = useState(false);
  const workItems = content.jobs.map((job) => {
    return (
      <AboutWorkItem key={job.company}>
        <AboutWorkItemDate>{job.dates}</AboutWorkItemDate>
        <AboutCompanyLocationContainer>
          <AboutWorkItemCompany>
            <a target="_blank" href={job.companyUrl} rel="noreferrer">
              {job.company}
            </a>
          </AboutWorkItemCompany>
          <AboutWorkItemLocation>{job.location}</AboutWorkItemLocation>
        </AboutCompanyLocationContainer>
        <AboutWorkItemJobTitle>{job.title}</AboutWorkItemJobTitle>
      </AboutWorkItem>
    );
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      audio = new Audio(
        "https://evan-bio-assets.s3.amazonaws.com/sauron-voice.m4a"
      );
    }
  }, []);

  if (showEye) {
    if (!audioPlaying) {
      audioPlaying = true;
      audio.play();
      audio.onended = () => {
        setShowEye(false);
        audio.currentTime = 0;
      };
    }
    processEyeOfSauron(eyeOfSauronRef);
  } else {
    if (audio) {
      audioPlaying = false;
      audio.pause();
      audio.currentTime = 0;
    }
    processEyeOfSauron(null);
  }

  return (
    <AboutSectionWrapper ref={innerRef}>
      <EyeOfSauronWrapper isOn={showEye}>
        <canvas ref={eyeOfSauronRef}></canvas>
      </EyeOfSauronWrapper>
      <AboutHeaderSection>
        <StyledLaptopIcon />
        <AboutHeaderTitle>About</AboutHeaderTitle>
        <Link href="/resume" passHref>
          <AboutHeaderResumeLink>
            Full resume
            <RightArrow />
          </AboutHeaderResumeLink>
        </Link>
      </AboutHeaderSection>
      <AboutContentSection>
        <AboutBioSection>
          <AboutBioTitle isFirst>My Story</AboutBioTitle>
          <AboutBioText isOn={showEye}>
            Despite what the fancy CSS star animations suggest, most of my
            experience has been in backend and full-stack development. I've been
            on projects dealing entirely with microservices and cloud
            migrations, and others that required me to design responsive and
            highly stateful frontends. At GitHub, I'm helping build internal
            tooling that does a little of everything; like helping ICs with
            agile automations, managers with Slack notifications/updates, and
            VPs with responsive HTML reports.
            <br />
            <br />
            In every project, I strive to learn the ever-changing and unique
            requirements to best contribute. Lately, I've been learning to
            resist the developer's impulse to tunnel vision into creating a
            robustly engineered system while losing sight of an MVP. In this
            way, developers are like Frodo, and removing tech debt is a ring we
            must keep close. Sometimes you need to wear it, but it may come with
            a cost.{" "}
            <span onClick={() => setShowEye((prev) => !prev)}>
              <RingIcon />
            </span>
            &nbsp;
            {showEye && (
              <button onClick={() => setShowEye(false)}>Take it off?</button>
            )}
            <br />
            <br />
            As a co-worker, I value the happiness of the people I work with. I
            want each team member to feel like they have a voice, are encouraged
            to contribute, and are happy with their contributions. My work
            leaves me feeling energized and fulfilled, and I want everyone to
            have the opportunity to feel the same way about their own work.
          </AboutBioText>
        </AboutBioSection>
        <AboutWorkSection>
          <AboutBioTitle>Where I've Worked</AboutBioTitle>
          {workItems}
        </AboutWorkSection>
      </AboutContentSection>
    </AboutSectionWrapper>
  );
}

const AboutSectionBreakpoints = setEachBreakpoint({
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
const AboutSectionWrapper = styled.div`
  min-height: 100vh;
  display: block;
  padding-top: 5%;
  padding-bottom: 100px;
  padding-left: 5vw;
  padding-right: 5vw;
  justify-content: center;
  align-items: center;
  background-color: white;
  position: relative;
  overflow: hidden;
  z-index: 2;
  font-family: "Helvetica Now", sans-serif;
  ${AboutSectionBreakpoints}
`;

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

const StyledLaptopIconBreakpoints = setEachBreakpoint({
  xs: `
  width: 2em;
  margin-right: 1em;
  `,
});
const StyledLaptopIcon = styled(LaptopIcon)`
  width: 3em;
  margin-right: 1.4em;
  ${StyledLaptopIconBreakpoints}
`;

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

const AboutHeaderResumeLink = styled.a`
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

const AboutContentSmall = `
  flex-direction: column;
  align-items: center;
`;
const AboutContentBreakpoints = setEachBreakpoint({
  xs: AboutContentSmall,
  sm: AboutContentSmall,
  md: AboutContentSmall,
});
const AboutContentSection = styled.div`
  display: flex;
  flex-direction: row;
  ${AboutContentBreakpoints}
`;

const AboutBioBreakpoints = setEachBreakpoint({
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
const AboutBioSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-right: 5%;
  ${AboutBioBreakpoints}
`;

const AboutBioTitleBreakpoints = (props) =>
  setEachBreakpoint({
    xs: `
  ${
    props.isFirst
      ? `
    margin-top: .5em;
    margin-bottom: .3em;
  `
      : `
    margin-top: 1em;
    margin-bottom: .5em;
  `
  }
  font-size: 5.5vw;
  line-height: 1.5em;
  `,
    sm: `
  font-size: 4.0vw;
  line-height: 1.5em;
  margin-bottom: .5em;
  `,
    md: `
  font-size: 3.0vw;
  line-height: 1.4em;
  margin-bottom: .7em;
  `,
  });
const AboutBioTitle = styled.h3`
  line-height: 1.5em;
  font-size: 1.5em;
  color: #666;
  font-weight: 500;
  margin-bottom: 1em;
  ${AboutBioTitleBreakpoints}
`;

const AboutBioText = styled.p`
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

const AboutWorkSectionBreakpoints = setEachBreakpoint({
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

const AboutWorkSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-left: 5%;
  ${AboutWorkSectionBreakpoints}
`;

const AboutWorkItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const AboutCompanyLocationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const AboutWorkItemDate = styled.span`
  line-height: 0.9em;
  font-size: 0.9em;
  color: #999;
`;

const AboutWorkItemCompany = styled.a`
  line-height: 1.2em;
  font-size: 1.2em;
  margin-top: 0.4em;
  margin-bottom: 0;
  margin-right: 0.7em;
  min-width: fit-content;

  a {
    text-decoration: none;
    color: black;
    font-weight: 700;
    :hover {
      color: rgb(95, 145, 255);
    }
  }
`;
const AboutWorkItemLocation = styled.span`
  margin-top: 0.4em;
  margin-bottom: 0;
  line-height: 1.2em;
  font-size: 1.2em;
  color: #666;
  min-width: fit-content;
`;
const AboutWorkItemJobTitle = styled.h5`
  line-height: 1.2em;
  font-size: 1.2em;
  font-weight: normal;
  margin: 0;
  margin-top: 0.4em;
  margin-bottom: 1.5em;
`;

const EyeOfSauronWrapper = styled.div`
  ${(props) =>
  !props.isOn &&
    `
    display: none;
  `}
  position: fixed;
  top: 20%;
  left: calc(50% - 250px);
  z-index: -4;
  border-radius: 100%;
`;
