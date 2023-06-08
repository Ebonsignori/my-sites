import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import Copyright from "../../shared/components/copyright";
import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import {
  getImageSetSrc,
  responsiveBackgroundImageUrl,
} from "../../shared/utils/image";
import ShootingStars from "../src/components/shooting-stars";
import SocialIcons from "../src/components/social-icons";
import WaveHand from "../src/components/wave-hand";
import AboutSection from "../src/sections/about-section";
import ContactSection from "../src/sections/contact-section";
import SunMode from "../src/sections/sun-mode";
import UsageSection from "../src/sections/usage-section";
import fetchContent from "../src/utils/fetch-content";

// Total time in ms to show wave intro before displaying full page
const LOAD_TIME = 2000;

export default function Home({ content }) {
  const aboutSectionRef = useRef(null);
  const [introLoadFinished, setIntroLoadFinished] = useState(false);
  const [postLoadingFinished, setPostLoadingFinished] = useState(false);
  const [imageClickCount, setImageClickCount] = useState(0);
  const [imageAnimating, setImageAnimating] = useState(false);

  // Kick off loading countdown on first render
  const startPostLoading = useCallback(() => {
    setTimeout(() => setPostLoadingFinished(true), 250);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIntroLoadFinished(true);
      // Second countdown is for toggling page opacity animation
      startPostLoading();
    }, LOAD_TIME);
  }, [startPostLoading]);

  const isSunMode = useMemo(() => imageClickCount >= 3, [imageClickCount]);

  const ShootingStarsRender = useMemo(() => {
    if (!isSunMode && postLoadingFinished) {
      return <ShootingStars />;
    }
    return null;
  }, [isSunMode, postLoadingFinished]);

  const PageRender = useMemo(() => {
    if (isSunMode) {
      return <SunMode content={content} />;
    }
    return (
      <>
        {ShootingStarsRender}
        <GreetingTitleSection>
          <WaveHand introLoadFinished={introLoadFinished} />
          <GreetingTitle>
            <LetterOne>H</LetterOne>
            <LetterTwo>i</LetterTwo>
            <LetterThree postLoadingFinished={postLoadingFinished}>
              ,
            </LetterThree>
          </GreetingTitle>
        </GreetingTitleSection>
        <ProfileImageWrapper postLoadingFinished={postLoadingFinished}>
          <StyledProfileImg
            clickCount={imageClickCount}
            onAnimationStart={() => setImageAnimating(true)}
            onAnimationEnd={() => setImageAnimating(false)}
            onClick={() =>
              !imageAnimating &&
              imageClickCount <= 5 &&
              setImageClickCount((prevCount) => prevCount + 1)
            }
            srcSet={getImageSetSrc("evan-2023-profile-picture", true)}
            width="250"
            height="250"
            alt="Evan Bonsignori's profile"
          />
        </ProfileImageWrapper>
        <GreetingText postLoadingFinished={postLoadingFinished}>
          I'm <strong>Evan Bonsignori</strong>, based out of Portland, Oregon.
          Trying to create more than I consume,
        </GreetingText>
        <PageLinks postLoadingFinished={postLoadingFinished}>
          <PageLink href={process.env.WRITING_PAGE_URL}>Writing</PageLink>
          <PageLink href={process.env.PHOTOS_PAGE_URL}>Photography</PageLink>
          <PageLink href={process.env.MUSIC_PAGE_URL}>Music</PageLink>
        </PageLinks>
        <StyledSocialIcons
          content={content}
          postLoadingFinished={postLoadingFinished}
        />
        <ScrollDownArrowWrapper
          postLoadingFinished={postLoadingFinished}
          onClick={() =>
            aboutSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            })
          }
        >
          <ScrollDownArrow />
        </ScrollDownArrowWrapper>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ShootingStarsRender,
    isSunMode,
    imageAnimating,
    imageClickCount,
    introLoadFinished,
    postLoadingFinished,
  ]);

  const SectionsRender = useMemo(() => {
    if (!isSunMode && postLoadingFinished) {
      return (
        <>
          <AboutSection innerRef={aboutSectionRef} content={content} />
          <UsageSection content={content} />
          <ContactSection content={content} />
          <Copyright invertColors />
        </>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postLoadingFinished, isSunMode]);

  return (
    <PageWrapper doneLoading={introLoadFinished} isSunMode={isSunMode}>
      <PageHeader postLoadingFinished={postLoadingFinished}>
        {PageRender}
        <BackgroundImage postLoadingFinished={postLoadingFinished} />
      </PageHeader>
      {SectionsRender}
    </PageWrapper>
  );
}

const OPACITY_TRANSITION = (props) => `
  opacity: 0;
  transition: opacity 2s ease-in;
  ${props.postLoadingFinished && `opacity: 1;`}
`;

export async function getStaticProps() {
  const content = fetchContent();
  return {
    props: {
      content,
    },
  };
}

const PageWrapperProps = (props) => {
  if (props.isSunMode) {
    return `
visibility: visible;
    overflow: hidden;
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
}
    `;
  } else {
    return props.doneLoading
      ? `
    visibility: visible;
    `
      : `
    visibility: hidden;
    `;
  }
};
const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  z-index: 1;
  ${PageWrapperProps}

  /* Used by child components */
  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const BackgroundImageProps = (props) =>
  props.postLoadingFinished &&
  `
  width: 100vw;
  height: 100%;
  min-height: 100vh;
`;
const BackgroundImage = styled.div`
  ${OPACITY_TRANSITION}
  ${BackgroundImageProps}
  position: absolute;
  z-index: -1;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  ${responsiveBackgroundImageUrl("stary-night-prineville-sky", true)}
`;

const PageHeaderBreakpoints = setEachBreakpoint({
  xs: `
      min-height: 100vh;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
     `,
  sm: `
      min-height: 100vh;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
     `,
});
const PageHeader = styled.header`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, fr);
  width: 100vw;
  height: 100vh;
  background-color: black;
  color: white;
  z-index: 1;

  ${PageHeaderBreakpoints}
`;

const GreetingTitleSectionBreakpoints = setEachBreakpoint({
  xs: `
      margin-top: 5%;
      font-size: 4em;
      justify-content: center;
     `,
  sm: `
      margin-top: 5%;
      font-size: 6em;
      justify-content: center;
     `,
  md: `
      font-size: 6em;
      `,
  lg: `
      font-size: 8em;
      `,
  xl: `
      font-size: 9em;
      `,
  xxl: `
      font-size: 10em;
      `,
});
const GreetingTitleSection = styled.div`
  visibility: visible !important;
  display: flex;
  flex-direction: row;
  color: black;
  transition: color 1s ease;
  visibility: visible;
  grid-row: 2 / 3;
  grid-column: 2 / 4;
  align-items: flex-end;
  z-index: 5;
  font-size: 8em;
  opacity: 1 !important;
  ${GreetingTitleSectionBreakpoints}
`;

const GreetingTitle = styled.h1`
  z-index: 3;
  margin: 0;
  margin-left: 0.5em;
  font-size: inherit;
  font-weight: 700;
  color: white;
`;

const LetterOne = styled.span`
  user-select: none;
  opacity: 0;
  animation-delay: 0.5s;
  animation-duration: 1s;
  animation-name: fadeInAnimation;
  animation-fill-mode: forwards;
`;
const LetterTwo = styled.span`
  user-select: none;
  opacity: 0;
  animation-delay: 1s;
  animation-duration: 1s;
  animation-name: fadeInAnimation;
  animation-fill-mode: forwards;
`;
const LetterThree = styled.span`
  opacity: 0;
  user-select: none;
  animation-delay: 1.5s;
  animation-duration: 1s;
  animation-name: fadeInAnimation;
  animation-fill-mode: forwards;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 2 / 4;
  grid-column: 5 / 7;
  justify-content: center;
  z-index: 5;
  ${OPACITY_TRANSITION}
  opacity: 1;
`;

const StyledProfileImgProps = (props) => {
  let styles = "";
  if (props.clickCount === 1) {
    styles = `
        animation: rotate-half 2s ease-out 1 forwards;
        @keyframes rotate-half {
          to {
            transform: rotateZ(-180deg);
          }
        }
      `;
  } else if (props.clickCount === 2) {
    styles = `
        transform: rotateZ(-180deg);
        animation: rotate-full 2s ease-out 1 forwards, toBW 2s linear 1 forwards;
        @keyframes rotate-full {
          to {
            transform: rotateZ(-360deg);
          }
        }
        @keyframes toBW {
          0%    { filter: grayscale(0%); }
          25%   { filter: grayscale(25%); }
          50%   { filter: grayscale(50%); }
          75%   { filter: grayscale(75%); }
          100%  { filter: grayscale(100%); }
        }
      `;
  } else if (props.clickCount >= 3) {
    styles = `
        filter: grayscale(100%);
      `;
  }
  return styles;
};
const StyledProfileImgBreakpoints = setEachBreakpoint({
  xs: `
      width: 40vw;
     `,
  sm: `
      width: 35vw;
     `,
  md: `
      width: 32vw;
      `,
  lg: `
      width: 28vw;
    `,
  xl: `
      width: 25vw;
    `,
  xxl: `
      width: 22vw;
    `,
});
const StyledProfileImg = styled.img`
  user-select: none;
  border: 3px solid white;
  border-radius: 100%;
  width: 25vw;
  height: auto !important;
  transition: transform 3s;
  ${StyledProfileImgBreakpoints}
  ${StyledProfileImgProps}

  :hover {
    cursor: pointer;
  }
`;

const GreetingTextBreakpoints = setEachBreakpoint({
  xs: `
      padding-left: 10%;
      padding-right: 10%;
      justify-content: center;
      text-align: center;
      font-size: 1.5rem;
      line-height: 2.25rem;
     `,
  sm: `
      padding-left: 10%;
      padding-right: 10%;
      justify-content: center;
      text-align: center;
      font-size: 1.7rem;
      line-height: 2.55rem;
     `,
  md: `
      font-size: 1.4rem;
      line-height: 2.1rem;
      `,
  lg: `
      font-size: 1.55rem;
      line-height: 2.325rem;
      `,
  xl: `
      font-size: 2rem;
      line-height: 3rem;
      `,
  xxl: `
      max-width: 75%;
      font-size: 2rem;
      line-height: 3rem;
  `,
});
const GreetingText = styled.main`
  margin-block-start: 1rem;
  margin-block-end: 1rem;
  ${OPACITY_TRANSITION}
  user-select: none;
  grid-row: 3 / 4;
  grid-column: 2 / 5;
  color: white;
  padding-left: 5%;
  padding-right: 5%;
  z-index: 1;

  ${GreetingTextBreakpoints}
`;

const PageLinksBreakpoints = setEachBreakpoint({
  xs: `
      flex-direction: column;
      align-content: center;
     `,
  sm: `
      flex-direction: column;
      align-content: center;
     `,
  md: "",
  lg: "",
  xl: "",
  xxl: "",
});
const PageLinks = styled.div`
  ${OPACITY_TRANSITION}
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  grid-row: 4 / 5;
  grid-column: 2 / 7;
  z-index: 5;

  ${PageLinksBreakpoints}
`;

const PageLinkBreakpoints = setEachBreakpoint({
  xs: `
      font-size: 2.1rem;
      margin-bottom: 1.5rem;
      box-shadow: inset 0 0px 0 white, inset 0 -1px 0 white;
     `,
  sm: `
      font-size: 2.8rem;
      margin-bottom: 2rem;
     `,
  md: `
      font-size: 3rem;
      margin-bottom: 3.5rem;
    `,
  lg: "",
  xl: "",
  xxl: "",
});
const PageLink = styled.a`
  color: white;
  text-decoration: none;
  z-index: 2;
  height: fit-content;
  font-size: 3rem;
  font-weight: 900;
  padding-bottom: 4px;
  box-shadow: inset 0 0px 0 white, inset 0 -2px 0 white;

  ${PageLinkBreakpoints}

  :hover {
    cursor: pointer;
    color: rgb(95, 145, 255);
    box-shadow: none;
  }
`;

const ScrollDownArrowWrapperBreakpoints = setEachBreakpoint({
  xs: `
    display: none;
  `,
  sm: `
    left: 80%;
  `,
});
const ScrollDownArrowWrapper = styled.div`
  ${OPACITY_TRANSITION}
  ${ScrollDownArrowWrapperBreakpoints}
  bottom: 1%;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 49%;
  min-width: 5rem;
  min-height: 5rem;
  z-index: 5;
  :hover {
    cursor: pointer;
    span {
      border-left: 1px solid rgb(95, 145, 255);
      border-bottom: 1px solid rgb(95, 145, 255);
    }
  }
`;
const ScrollDownArrow = styled.span`
  position: absolute;
  width: 3rem;
  height: 3rem;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-animation: sdb05 1s infinite;
  animation: sdb05 1s infinite;
  box-sizing: border-box;
  @-webkit-keyframes sdb05 {
    0% {
      -webkit-transform: rotate(-45deg) translate(0, 0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      -webkit-transform: rotate(-45deg) translate(-20px, 20px);
      opacity: 0;
    }
  }
  @keyframes sdb05 {
    0% {
      transform: rotate(-45deg) translate(0, 0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: rotate(-45deg) translate(-20px, 20px);
      opacity: 0;
    }
  }
`;

const StyledSocialIcons = styled(SocialIcons)`
  z-index: 5;
  ${OPACITY_TRANSITION}
`;
