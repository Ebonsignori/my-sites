import {
  ContentSection,
  SectionWrapper,
  TextContent,
} from "../components/section-elements";
import SectionHeader from "../components/section-header";
import CodeBracketsIcon from "../svgs/code-brackets";

export default function UsageSection({ content }) {
  return (
    <SectionWrapper>
      <SectionHeader
        headerTitle="Usage"
        linkTitle="Source Code"
        linkUrl={content.repoUrl}
        Icon={CodeBracketsIcon}
      />
      <ContentSection>
        <TextContent wide>
          <p>
            The source code for this website along with my{" "}
            <a href={process.env.WRITING_PAGE_URL}>Writing</a>,{" "}
            <a href={process.env.PHOTOS_PAGE_URL}>Photography</a>, and{" "}
            <a href={process.env.MUSIC_PAGE_URL}>Music</a> sites are all freely
            available at <a href={content.repoUrl}>GitHub</a>.{" "}
          </p>
        </TextContent>
      </ContentSection>
    </SectionWrapper>
  );
}
