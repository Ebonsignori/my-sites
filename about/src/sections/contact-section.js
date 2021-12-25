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
            Typically this section has a nice little contact form, but I've had
            mixed success in preventing bots from hitting it.
          </p>{" "}
          <p>
            If you'd like to get in touch, please{" "}
            <a href={content.socialLinks.linkedin}>message me on Linkedin!</a>
          </p>
        </TextContent>
      </ContentSection>
    </SectionWrapper>
  );
}
