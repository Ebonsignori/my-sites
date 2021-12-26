import { memo, useMemo } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import {
  ContentSection,
  RightContentSection,
  SectionText,
  SectionWrapper,
  TextContent,
} from "../components/section-elements";
import SectionHeader from "../components/section-header";
import GroupIcon from "../svgs/group-icon";
import LaptopIcon from "../svgs/laptop";

function AboutSection({ content, innerRef }) {
  const workItems = useMemo(
    () =>
      content.jobs.map((job) => {
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
      }),
    [content.jobs]
  );

  return (
    <SectionWrapper ref={innerRef}>
      <SectionHeader
        headerTitle="About"
        linkTitle="Full Resume"
        linkUrl={`${process.env.BASE_ASSET_URL}/Resume+-+Evan+Bonsignori.pdf`}
        Icon={LaptopIcon}
      />
      <ContentSection>
        <TextContent>
          <Title>Developer Story</Title>
          <SectionText>
            <p>
              Despite what the CSS star animations may suggest, most of my
              experience has been in backend and full-stack development. I've
              been on projects dealing entirely with microservices and cloud
              migrations, and others that required me to design responsive and
              highly stateful frontends. At GitHub, I'm helping build internal
              tooling that does a little of everything; like helping ICs with
              agile automations, managers with Slack notifications/updates, and
              VPs with responsive HTML reports.
            </p>
            <p>
              As a co-worker, I value the happiness of the people I work with. I
              want each team member to feel like they have a voice, are
              encouraged to contribute, and are happy with their contributions.
              My work leaves me feeling energized and fulfilled, and I want
              everyone to have the opportunity to feel the same way about their
              own work.
            </p>
          </SectionText>
        </TextContent>
        <RightContentSection hideOnMobile>
          <Title>Where I've Worked</Title>
          {workItems}
        </RightContentSection>
      </ContentSection>
      <MobileOnlySection>
        <SectionHeader
          headerTitle="Work"
          linkTitle="Linkedin"
          linkUrl="https://www.linkedin.com/in/ebonsignori/"
          Icon={GroupIcon}
        />
        <MobileWorkSection>
          <RightContentSection>{workItems}</RightContentSection>
        </MobileWorkSection>
      </MobileOnlySection>
    </SectionWrapper>
  );
}

export default memo(AboutSection);

const TitleBreakpoints = () =>
  setEachBreakpoint({
    xs: `
    display: none;
  `,
    sm: `
    display: none;
  `,
    md: `
    display: none;
  `,
  });
const Title = styled.h3`
  line-height: 1.5rem;
  font-size: 2rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 0;
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
  margin-top: 1.5rem;
  line-height: 0.9rem;
  font-size: 0.9rem;
  color: #999;
`;

const JobCompany = styled.h4`
  line-height: 1.2rem;
  font-size: 1.2rem;
  margin-top: 0.4rem;
  margin-bottom: 0;
  margin-right: 0.7rem;
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
  margin-top: 0.4rem;
  margin-bottom: 0;
  line-height: 1.2rem;
  font-size: 1.2rem;
  color: #666;
  min-width: fit-content;
`;
const JobTitle = styled.h5`
  font-family: var(--body-family);
  line-height: 1.2rem;
  font-size: 1.2rem;
  font-weight: normal;
  margin: 0;
  margin-top: 0.4rem;
`;

const MobileOnlySectionBreakpoints = setEachBreakpoint({
  lg: "display: none",
  xl: "display: none",
  xxl: "display: none",
});
const MobileOnlySection = styled.div`
  ${MobileOnlySectionBreakpoints}
`;
const MobileWorkSection = styled(ContentSection)`
  flex-direction: row;
  justify-content: center;
`;
