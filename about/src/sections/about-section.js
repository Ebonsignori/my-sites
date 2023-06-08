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
          <Title>Me</Title>
          <SectionText>
            <p>
              In many ways, I'm a recovering ADHD kid who has learned to adapt
              via lifestyle changes. I've spent most of my adult life abstaining
              from video games, news, social media, TV, added sugar, alcohol,
              and caffeine. Avoiding these things has enabled me to focus on
              habits that keep me healthy, happy, and productive.
            </p>
            <p>
              I love to climb, camp, and hike outdoors with my dog Syl, but look
              forward to rainy PNW winters when I can devote time to indoor
              hobbies without sun FOMO. Then I enjoy playing classical piano,
              reading books for book club, and playing board games with friends.
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
