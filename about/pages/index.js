/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import {
  getImageSetSrc,
  responsiveBackgroundImageUrl,
} from "../../shared/utils/image";
// import AboutSection from "../src/components/about-section";
import ShootingStars from "../src/components/shooting-stars";
import SunMode from "../src/components/sun-mode";
import WaveHand from "../src/components/wave-hand";
import fetchContent from "../src/utils/fetch-content";

// Total time in ms to show wave intro before displaying full page
const LOAD_TIME = 2200;

export default function Home({ content }) {
  const [introLoadFinished, setIntroLoadFinished] = useState(false);
  const [postLoadingFinished, setPostLoadingFinished] = useState(false);
  const [imageClickCount, setImageClickCount] = useState(0);
  const [imageAnimating, setImageAnimating] = useState(false);

  // Kick off loading countdown on first render
  const startPostLoading = () =>
    setTimeout(() => setPostLoadingFinished(true), 1);
  useEffect(() => {
    setTimeout(() => {
      setIntroLoadFinished(true);
      // Second countdown is for toggling page opacity animation
      startPostLoading();
    }, LOAD_TIME);
  }, []);

  const isSunMode = imageClickCount >= 4;

  let PageRender = (
    <>
      <GreetingTitleSection>
        {!isSunMode && postLoadingFinished && <ShootingStars />}
        <WaveHand introLoadFinished={introLoadFinished} />
        <GreetingTitle doneLoading={introLoadFinished}>
          <LetterOne>H</LetterOne>
          <LetterTwo>i</LetterTwo>
          <LetterThree postLoading={postLoadingFinished}>,</LetterThree>
        </GreetingTitle>
      </GreetingTitleSection>
      <ProfileImageWrapper>
        <StyledProfileImg
          clickCount={imageClickCount}
          onAnimationStart={() => setImageAnimating(true)}
          onAnimationEnd={() => setImageAnimating(false)}
          onClick={() =>
            !imageAnimating &&
            imageClickCount <= 5 &&
            setImageClickCount((prevCount) => prevCount + 1)
          }
          srcSet={getImageSetSrc("evan-2021-profile-picture", true)}
          alt="Evan Bonsignori's profile"
        />
      </ProfileImageWrapper>
      <GreetingText>
        I'm <strong>Evan Bonsignori</strong>, a digital nomad travelling the
        west. When I'm not writing code for {content.currentCompany} or
        practicing mindfulness, I'm enjoying one of my hobbies,
      </GreetingText>
      <PageLinks>
        <PageLink href={process.env.WRITING_PAGE_URL}>Writing</PageLink>
        <PageLink href={process.env.PHOTOS_PAGE_URL}>Photography</PageLink>
        <PageLink href={process.env.MUSIC_PAGE_URL}>Music</PageLink>
      </PageLinks>
    </>
  );

  if (isSunMode) {
    PageRender = <SunMode />;
  }

  return (
    <PageWrapper
      doneLoading={introLoadFinished}
      postLoading={postLoadingFinished}
    >
      <PageHeader>{PageRender}</PageHeader>
    </PageWrapper>
  );
}

export async function getStaticProps() {
  const content = fetchContent();
  return {
    props: {
      content,
    },
  };
}

const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  ${(props) =>
    props.doneLoading
      ? `
    visibility: visible;
    opacity: 0;
  `
      : `
    visibility: hidden;
  `}
  ${(props) =>
    props.postLoading &&
    `
    transition: opacity 1s ease-in;
    opacity: 1 !important;
  `}

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

const PageHeader = styled.header`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, fr);
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: black;
  color: white;
  z-index: -1;
  ${responsiveBackgroundImageUrl("stary-night-prineville-sky", true)}

  ${setEachBreakpoint({
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
  })}
`;

const GreetingTitleSection = styled.div`
  display: flex;
  flex-direction: row;
  color: black;
  transition: color 1s ease;
  visibility: visible;
  grid-row: 2 / 3;
  grid-column: 2 / 4;
  align-items: flex-end;
  z-index: 1;
  font-size: 8em;
  ${setEachBreakpoint({
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
  })}
`;

const GreetingTitle = styled.h1`
  margin: 0;
  margin-left: 0.5em;
  font-size: inherit;
  font-weight: 700;
  color: white;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const LetterOne = styled.span`
  opacity: 0;
  animation-duration: 1s;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
`;
const LetterTwo = styled.span`
  opacity: 0;
  animation-delay: 0.3s;
  animation-duration: 1s;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
`;
const LetterThree = styled.span`
  ${(props) =>
    props.postLoading
      ? `
      visibility: visible;

  `
      : `visibility: hidden;`}
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 2 / 4;
  grid-column: 5 / 7;
  justify-content: center;
  z-index: 1;
`;

const StyledProfileImg = styled.img`
  z-index: 2;
  border: 3px solid white;
  border-radius: 100%;
  width: 25vw;
  ${setEachBreakpoint({
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
  })}

  transition: transform 3s;
  ${(props) => {
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
        animation: rotate-full 2s ease-out 1 forwards;
        @keyframes rotate-full {
          to {
            transform: rotateZ(-360deg);
          }
        }
      `;
    } else if (props.clickCount === 3) {
      styles = `
        animation: toBW 2s linear 1 forwards;
        @keyframes toBW {
          0%    { filter: grayscale(0%); }
          25%   { filter: grayscale(25%); }
          50%   { filter: grayscale(50%); }
          75%   { filter: grayscale(75%); }
          100%  { filter: grayscale(100%); }
        }
    `;
    } else if (props.clickCount >= 4) {
      styles = `
        filter: grayscale(100%);
      `;
    }
    return styles;
  }}
`;

const GreetingText = styled.p`
  grid-row: 3 / 4;
  grid-column: 2 / 5;
  font-size: 2em;
  line-height: 1.5em;
  color: white;
  padding-left: 5%;
  padding-right: 5%;

  strong {
    font-family: cursive;
    font-weight: 900;
  }

  ${setEachBreakpoint({
    xs: `
      padding-left: 10%;
      padding-right: 10%;
      justify-content: center;
      text-align: center;
      font-size: 2.7vh;
      line-height: 4vh;
     `,
    sm: `
      padding-left: 10%;
      padding-right: 10%;
      justify-content: center;
      text-align: center;
      font-size: 2.8vh;
      line-height: 4.5vh;
     `,
    md: `
      font-size: 1.5em;
      `,
    lg: `
      font-size: 1.5em;
      `,
    xl: `
      font-size: 2em;
      line-height: 1.5em;
      `,
    xxl: "",
  })}
`;

const PageLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  grid-row: 4 / 5;
  grid-column: 2 / 7;

  ${setEachBreakpoint({
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
  })}
`;

const PageLink = styled.a`
  color: white;
  text-decoration: none;
  z-index: 2;
  height: fit-content;
  font-size: 3em;
  font-weight: 900;
  box-shadow: inset 0 0px 0 white, inset 0 -2px 0 white;

  ${setEachBreakpoint({
    xs: `
      font-size: 2em;
      margin-bottom: 4vh;
      box-shadow: inset 0 0px 0 white, inset 0 -1px 0 white;
     `,
    sm: `
      font-size: 2.8em;
      margin-bottom: 3vh;
     `,
    md: `
      font-size: 3em;
      margin-bottom: 5vh;
    `,
    lg: "",
    xl: "",
    xxl: "",
  })}

  :hover {
    cursor: pointer;
    background: linear-gradient(
      to left,
      #fff 20%,
      rgba(0, 0, 225, 0.2) 40%,
      rgba(95, 145, 225, 1) 60%,
      #fff 80%
    );
    background-size: 200% auto;

    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shine 3s linear infinite;
    box-shadow: inset 0 0px 0 white, inset 0 -3px 0 rgba(95, 145, 225, 0.5) !important;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;
