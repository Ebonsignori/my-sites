/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import processEyeOfSauron from "../components/eye-of-sauron";
import {
  ContentSection,
  LeftContentSection,
  RightContentSection,
  SectionText,
  SectionWrapper,
} from "../components/section-elements";
import SectionHeader from "../components/section-header";
import LaptopIcon from "../svgs/laptop";
import RingIcon from "../svgs/ring";

let audioPlaying = false;
let audio;

export default function AboutSection({ content, innerRef }) {
  const eyeOfSauronRef = useRef(null);
  const [showEye, setShowEye] = useState(false);
  const workItems = content.jobs.map((job) => {
    return (
      <JobItem key={job.company}>
        <JobDate>{job.dates}</JobDate>
        <CompanyLocationRow>
          <JobCompany>
            <a target="_blank" href={job.companyUrl} rel="noreferrer">
              {job.company}
            </a>
          </JobCompany>
          <JobLocation>{job.location}</JobLocation>
        </CompanyLocationRow>
        <JobTitle>{job.title}</JobTitle>
      </JobItem>
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
    <SectionWrapper ref={innerRef}>
      <EyeOfSauronWrapper isOn={showEye}>
        <canvas ref={eyeOfSauronRef}></canvas>
      </EyeOfSauronWrapper>
      <SectionHeader
        headerTitle="About"
        linkTitle="Full Resume"
        linkUrl="/resume"
        Icon={LaptopIcon}
      />
      <ContentSection>
        <LeftContentSection>
          <Title isFirst>My Story</Title>
          <SectionText isOn={showEye}>
            Despite what the CSS star animations may suggest, most of my
            experience has been in backend and full-stack development. I've been
            on projects dealing entirely with microservices and cloud
            migrations, and others that required me to design responsive and
            highly stateful frontends. At GitHub, I'm helping build internal
            tooling that does a little of everything; like helping ICs with
            agile automations, managers with Slack notifications/updates, and
            VPs with responsive HTML reports.
            <br />
            <br />
            In every project, I strive to learn the ever-changing requirements
            to best contribute. Lately, I've been learning to resist the
            developer's impulse to tunnel vision into creating a robustly
            engineered system while losing sight of an MVP. In this way,
            developers are like Frodo, and removing tech debt is a ring we must
            keep close. Sometimes you need to wear it, but it may come with a
            cost.{" "}
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
          </SectionText>
        </LeftContentSection>
        <RightContentSection>
          <Title>Where I've Worked</Title>
          {workItems}
        </RightContentSection>
      </ContentSection>
    </SectionWrapper>
  );
}

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

const TitleBreakpoints = (props) =>
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
const Title = styled.h3`
  line-height: 1.5em;
  font-size: 1.5em;
  color: #666;
  font-weight: 500;
  margin-bottom: 1em;
  ${TitleBreakpoints}
`;

const JobItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const CompanyLocationRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const JobDate = styled.span`
  line-height: 0.9em;
  font-size: 0.9em;
  color: #999;
`;

const JobCompany = styled.h4`
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
const JobLocation = styled.span`
  margin-top: 0.4em;
  margin-bottom: 0;
  line-height: 1.2em;
  font-size: 1.2em;
  color: #666;
  min-width: fit-content;
`;
const JobTitle = styled.h5`
  line-height: 1.2em;
  font-size: 1.2em;
  font-weight: normal;
  margin: 0;
  margin-top: 0.4em;
  margin-bottom: 1.5em;
`;
