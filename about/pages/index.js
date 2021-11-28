import styled from "styled-components";

import {
  getImageSetSrc,
  responsiveBackgroundImageUrl,
} from "../../shared/utils/image";

export default function Home() {
  return (
    <PageWrapper>
      <PageHeader>
        <StyledProfileImg
          srcSet={getImageSetSrc("evan-2021-profile-picture", true)}
          alt="Evan Bonsignori"
        />
      </PageHeader>
    </PageWrapper>
  );
}

const PageHeader = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  ${responsiveBackgroundImageUrl("stary-night-prineville-sky", true)}
  z-index: -1;
`;

const PageWrapper = styled.div`
  background-color: black;
  color: white;
`;

const StyledProfileImg = styled.img`
  width: 50vw;
  max-width: 50vw;
`;
