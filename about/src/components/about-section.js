/* eslint-disable react/no-unescaped-entities */
import styled from "styled-components";

export default function AboutSection({ content }) {
  const workItems = content.jobs.map((job) => {
    return (
      <AboutWorkItem key={job.company}>
        <AboutWorkItemDate>{job.dates}</AboutWorkItemDate>
        <AboutWorkItemCompany href={job.companyUrl}>
          {job.company}
        </AboutWorkItemCompany>
        <AboutWorkItemLocation>{job.location}</AboutWorkItemLocation>
        <AboutWorkItemJobTitle>{job.title}</AboutWorkItemJobTitle>
      </AboutWorkItem>
    );
  });

  return (
    <AboutSectionWrapper>
      <AboutHeaderSection>
        <AboutHeaderTitle>Resume</AboutHeaderTitle>
      </AboutHeaderSection>
      <AboutContentSection>
        <AboutBioSection>
          <AboutBioTitle>My Story</AboutBioTitle>
          <AboutBioText>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here, making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
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

const AboutSectionWrapper = styled.div`
  display: block;
  margin-right: 5%;
  margin-bottom: 100px;
  margin-left: 5%;
  justify-content: center;
  align-items: center;
  background-color: white;
  position: relative;
  overflow: hidden;
  z-index: 2;
`;

const AboutHeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 50px;
`;

const AboutHeaderTitle = styled.div`
  display: flex;
  flex-direction: row;
`;

const AboutContentSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const AboutBioSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 49%;
  margin-right: 2%;
  padding-right: 8%;
`;

const AboutBioTitle = styled.h3`
  color: #666;
  font-weight: 500;
`;

const AboutBioText = styled.p``;

const AboutWorkSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 49%;
`;

const AboutWorkItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const AboutWorkItemDate = styled.h5``;
const AboutWorkItemCompany = styled.h5``;
const AboutWorkItemLocation = styled.h5``;
const AboutWorkItemJobTitle = styled.h5``;
