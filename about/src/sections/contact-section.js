/* eslint-disable react/no-unescaped-entities */
import {
  ContentSection,
  SectionTextCenter,
  SectionWrapper,
} from "../components/section-elements";
import SectionHeader from "../components/section-header";
import PhoneIcon from "../svgs/phone";

export default function ContactSection({ content }) {
  return (
    <SectionWrapper>
      <SectionHeader
        headerTitle="Contact"
        linkTitle="Message on Linkedin"
        linkUrl={content.socialLinks.linkedin}
        Icon={PhoneIcon}
      />
      <ContentSection>
        <SectionTextCenter>
          Typically this section has a nice little contact form, but I've had
          mixed success in preventing bots from hitting it. If you'd like to get
          in touch, please{" "}
          <a href={content.socialLinks.linkedin}>message me on Linkedin!</a>
        </SectionTextCenter>
      </ContentSection>
    </SectionWrapper>
  );
}
