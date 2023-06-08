import {
  ContentSection,
  SectionWrapper,
  TextContent,
} from "../components/section-elements";
import SectionHeader from "../components/section-header";
import PhoneIcon from "../svgs/phone";

export default function ContactSection({ content }) {
  return (
    <SectionWrapper>
      <SectionHeader
        headerTitle="Contact"
        linkTitle="Message me"
        linkUrl={content.socialLinks.linkedin}
        Icon={PhoneIcon}
      />
      <ContentSection>
        <TextContent wide>
          <p>
            If you'd like to get in touch, please{" "}
            <a href={content.socialLinks.linkedin}>message me on Linkedin</a>,{" "}
            or you can find my personal email in{" "}
            <a
              href={`${process.env.BASE_ASSET_URL}/Resume+-+Evan+Bonsignori.pdf`}
            >
              my resume
            </a>
            .
          </p>
        </TextContent>
      </ContentSection>
    </SectionWrapper>
  );
}
