import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import {
  getStringAtBreakpoint,
  setEachBreakpoint,
} from "../../../shared/utils/breakpoints";
import { getRandomIntBetween } from "../../../shared/utils/random";
import processEyeOfSauron from "../components/eye-of-sauron";
import RingIcon from "../svgs/ring";
import useWindowDimensions from "../utils/window-size";

const MAX_STARS = 200;
const RANDOM_DISTANCE = 30;
const IMAGES_TO_PRELOAD = 4;

let musicPlaying = false;
let audio;

const sauronAudioSource =
  "https://evan-bio-assets.s3.amazonaws.com/sauron-voice.m4a";
let sauronAudioPlaying = false;
let sauronAudio;

export default function SunMode({ content }) {
  const eyeOfSauronRef = useRef(null);
  const { sunModeImages } = content;
  const windowDimensions = useWindowDimensions();
  const starWrapperRef = useRef(null);
  const [showEye, setShowEye] = useState(false);
  const [eyeHasShown, setEyeHasShown] = useState(false);
  const [numberOfStars, setNumberOfStars] = useState(0);
  const onRemoveStar = useCallback(() => {
    if (numberOfStars > -1) {
      setNumberOfStars((prevCount) => prevCount - 1);
      if (starWrapperRef.current.childNodes.length) {
        starWrapperRef.current.removeChild(
          starWrapperRef.current.childNodes[0]
        );
      }
    }
  }, []);
  const onAddStar = useCallback(() => {
    if (numberOfStars < MAX_STARS) {
      setNumberOfStars((prevCount) => prevCount + 1);
      if (numberOfStars >= 0) {
        const newStarSpinner = document.createElement("div");
        const newStar = document.createElement("div");
        const distance = getRandomIntBetween(0, RANDOM_DISTANCE);
        const width = getStringAtBreakpoint(windowDimensions, {
          xs: `
                ${distance + 65}vw
              `,
          sm: `
                ${distance + 55}vw
              `,
          md: `
                ${distance + 55}vw
               `,
          lg: `
                ${distance + 40}vw
              `,
          xl: `
                ${distance + 30}vw
              `,
          xxl: `
                ${distance + 28}vw
              `,
        });

        newStarSpinner.classList.add("star-spinner");
        newStar.classList.add("circling-star");
        newStarSpinner.appendChild(newStar);
        newStarSpinner.style.width = width;
        starWrapperRef.current.appendChild(newStarSpinner);
      }
    }
  }, []);

  useEffect(() => {
    // Start preload of audio 10 seconds after page load
    setTimeout(() => {
      if (typeof window !== "undefined") {
        sauronAudio = new Audio(sauronAudioSource);
      }
    }, 10000);
  }, []);

  useEffect(() => {
    if (showEye) {
      // If pressed before preload, load at press
      if (!sauronAudio) {
        sauronAudio = new Audio(sauronAudioSource);
      }
      if (!sauronAudioPlaying) {
        sauronAudioPlaying = true;
        sauronAudio.play();
        if (musicPlaying) {
          audio.pause();
          musicPlaying = false;
        }
        sauronAudio.onended = () => {
          setShowEye(false);
          sauronAudio.currentTime = 0;
          if (!musicPlaying) {
            audio.play();
            musicPlaying = true;
          }
        };
      }
      processEyeOfSauron(eyeOfSauronRef);
    } else if (sauronAudioPlaying) {
      setEyeHasShown(true);
      sauronAudioPlaying = false;
      sauronAudio.pause();
      sauronAudio.currentTime = 0;
      if (!musicPlaying) {
        audio.play();
        musicPlaying = true;
      }
      processEyeOfSauron(null);
    }
  }, [showEye]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audio = new Audio(
        "https://evan-bio-assets.s3.amazonaws.com/shooting-stars-loop.mp3"
      );
    }
  }, []);

  useEffect(() => {
    if (!musicPlaying && numberOfStars >= 10) {
      musicPlaying = true;
      audio.loop = true;
      audio.play();
    }
  }, [musicPlaying, numberOfStars]);

  const ChangeSectionRender = useMemo(() => {
    if (numberOfStars >= MAX_STARS) {
      return (
        <p>
          Ok, ok, if you want to keep being entertained{" "}
          <a href="https://www.youtube.com/playlist?list=PLFsQleAWXsj_4yDeebiIADdH5FMayBiJo">
            go here.
          </a>
        </p>
      );
    } else {
      return (
        <>
          <ChangeCountRow>
            <AddRemoveStar onClick={onRemoveStar} />
            <StarCount>{numberOfStars} Stars</StarCount>
            <AddRemoveStar isPlus onClick={onAddStar} />
          </ChangeCountRow>
        </>
      );
    }
  }, [numberOfStars, showEye]);

  const currentImage = useMemo(
    () => getCurrentImage(numberOfStars, sunModeImages),
    [numberOfStars]
  );

  const RingRender = useMemo(() => {
    if (!eyeHasShown && numberOfStars >= 100) {
      return (
        <RingWrapper isOn={showEye}>
          <span onClick={() => setShowEye((prev) => !prev)}>
            Go ahead, put it on <RingIcon />
          </span>
          &nbsp;
          {showEye && (
            <button onClick={() => setShowEye(false)}>Take it off?</button>
          )}
        </RingWrapper>
      );
    }
    return null;
  }, [eyeHasShown, showEye, numberOfStars]);

  return (
    <>
      <EyeOfSauronWrapper isOn={showEye}>
        <canvas ref={eyeOfSauronRef}></canvas>
      </EyeOfSauronWrapper>
      <StarsWrapper ref={starWrapperRef}></StarsWrapper>
      <ImagePreloader
        imageUrls={sunModeImages.slice(
          currentImage?.index,
          currentImage?.index + IMAGES_TO_PRELOAD + 1
        )}
      />
      <ChangeCountSection>{ChangeSectionRender}</ChangeCountSection>
      <SunWrapper>
        <SunImage imageUrl={currentImage?.url} />
        <Sun />
      </SunWrapper>
      {RingRender}
    </>
  );
}

// Hidden div that assists with preloading background images
const ImagePreloaderProps = (props) =>
  props?.imageUrls?.length &&
  props.imageUrls.map((img) => `url(${img.url})`).join(" ");
const ImagePreloader = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  z-index: -3;
  content: ${ImagePreloaderProps};
`;

const SunImageBreakpoints = setEachBreakpoint({
  xs: `
      height: 5em;
      width: 5em;
     `,
  sm: `
      height: 7em;
      width: 7em;
     `,
});

function getCurrentImage(numberOfStars, sunModeImages) {
  let image;
  let index = 0;
  for (const option of sunModeImages) {
    const startCondition = numberOfStars >= option.start;
    const endCondition = numberOfStars < option.end;

    let isSelectedOption = false;
    if (typeof option.start === "undefined" && endCondition) {
      isSelectedOption = true;
    } else if (typeof option.end === "undefined" && startCondition) {
      isSelectedOption = true;
    } else if (startCondition && endCondition) {
      isSelectedOption = true;
    }
    if (isSelectedOption) {
      image = {
        ...option,
        index,
      };
      break;
    }
    index += 1;
  }

  return image;
}

const SunImage = styled.div`
  z-index: 3;
  position: absolute;
  height: 10em;
  width: 10em;
  border-radius: 25%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  ${SunImageBreakpoints}
  background-image: url("${(props) => props.imageUrl}")
`;

const CirclingStarBreakpoints = setEachBreakpoint({
  xs: `
    width: 10vw;
   `,
  sm: `
    width: 7vw;
   `,
  md: `
    width: 5vw;
   `,
});

const StarsWrapper = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  .star-spinner {
    position: absolute;
    display: flex;
    justify-items: flex-end;
    justify-content: flex-end;

    animation: spin 10s linear infinite forwards;
    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .circling-star {
    transform: rotateZ(90deg);
    position: absolute;
    width: 1vw;
    height: 2px;
    background: linear-gradient(
      -45deg,
      rgba(95, 145, 255, 1),
      rgba(0, 0, 255, 0)
    );
    border-radius: 999px;
    filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
    animation: tail 3s ease-in-out infinite;

    ${CirclingStarBreakpoints}

    :before {
      content: "";
      position: absolute;
      top: calc(50% - 1px);
      right: 0;
      height: 2px;
      background: linear-gradient(
        -45deg,
        rgba(0, 0, 255, 0),
        rgba(95, 145, 255, 1),
        rgba(0, 0, 255, 0)
      );
      transform: translateX(50%) rotateZ(45deg);
      border-radius: 100%;
      width: 20px;
      animation: shining 3s ease-in-out infinite;
    }

    :after {
      content: "";
      position: absolute;
      top: calc(50% - 1px);
      right: 0;
      height: 2px;
      background: linear-gradient(
        -45deg,
        rgba(0, 0, 255, 0),
        rgba(95, 145, 255, 1),
        rgba(0, 0, 255, 0)
      );
      transform: translateX(50%) rotateZ(45deg);
      border-radius: 100%;
      width: 20px;
      transform: translateX(50%) rotateZ(-45deg);
    }

    @keyframes tail {
      0% {
        width: 1vw;
      }

      30% {
        width: 2vw;
      }

      100% {
        width: 1vw;
      }
    }

    @keyframes shining {
      0% {
        width: 20px;
      }

      50% {
        width: 40px;
      }

      100% {
        width: 20px;
      }
    }

    @keyframes orbit {
      100% {
        transform: rotate(360deg);
      }
    }
`;

const ChangeCountSection = styled.div`
  opacity: 0;
  z-index: 2;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin-top: 5%;
  animation: fadeInAnimation ease 3s forwards;
  text-align: center;

  p {
    color: white;
    font-size: 2em;
  }
  a {
    color: wheat;
  }
  a:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const ChangeCountBreakpoints = setEachBreakpoint({
  xs: `
      margin-top: 15%;
      font-size: 2.8em;
      width: 86vw;
     `,
  sm: `
      font-size: 4em;
      margin-top: 10%;
      width: 70vw;
     `,
  md: `
      width: 66vw;
      `,
  lg: `
    width: 45vw;

    `,
  xl: `
    width: 40vw;
    `,
  xxl: `
    width: 30vw;
    `,
});
const ChangeCountRow = styled.div`
  user-select: none;
  display: flex;
  flex-direction: row;
  font-size: 5em;
  width: 50vw;
  justify-content: space-evenly;

  ${ChangeCountBreakpoints}
`;

const StarCount = styled.div``;

const AddRemoveStarBreakpoints = (props) =>
  setEachBreakpoint({
    xs: `
    height: 1em;
    width: 1em;
    :after {
      height: 0.1em;
      width: .5em;
    }
    ${
      props.isPlus &&
      `
      :before {
        height: .5em;
        width: 0.1em;
      }
    `
    }
   `,
    sm: `
    height: 1em;
    width: 1em;
    :after {
      height: 0.1em;
      width: .5em;
    }
    ${
      props.isPlus &&
      `
      :before {
        height: .5em;
        width: 0.1em;
      }
    `
    }
   `,
    md: `
    height: 1em;
    width: 1em;
    :after {
      height: 0.1em;
      width: .5em;
    }
    ${
      props.isPlus &&
      `
      :before {
        height: .5em;
        width: 0.1em;
      }
    `
    }
    `,
  });
const AddRemoveStarProps = (props) =>
  props.isPlus &&
  `
      :before {
        height: .5em;
        width: 0.1em;
      }
`;
const AddRemoveStar = styled.div`
  ${(props) => AddRemoveStarBreakpoints(props)}
  height: 1em;
  width: 1em;
  font-size: 1em;
  * {
    user-select: none !important;
  }
  :hover {
    cursor: pointer;
    opacity: 0.9;
    background-color: lightblue;
  }

  border: 2px solid white;
  border-radius: 100%;
  position: relative;
  :after {
    height: 0.1em;
    width: 0.5em;
  }
  ${AddRemoveStarProps}

  &:after,
  &:before {
    content: "";
    display: block;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const SunWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const SunBreakpoints = setEachBreakpoint({
  xs: `
  height: 6em;
  width: 6em;
     `,
  sm: `
  height: 10em;
  width: 10em;

     `,
  md: `
  height: 15em;
  width: 15em;
      `,
  lg: `
  height: 20em;
  width: 20em;
      `,
  xl: `
  height: 20em;
  width: 20em;
      `,
  xxl: `
  height: 20em;
  width: 20em;
      `,
});
const Sun = styled.div`
  height: 10em;
  width: 10em;
  border-radius: 100%;
  z-index: 1;
  opacity: 0;

  ${SunBreakpoints}

  animation: sun-glow 10s linear infinite, sunrise 2s infinite linear forwards,
    rays 2s infinite linear, fadeInAnimation ease 3s forwards;

  background: #f1c40f;
  @keyframes sun-glow {
    0% {
      background: #f1c40f;
    }
    50% {
      background: #f1970f;
    }
    100% {
      background: #f1c40f;
    }
  }

  @keyframes sunrise {
    0% {
      box-shadow: none;
    }
  }

  @keyframes rays {
    0% {
      box-shadow: 0 0 0 0 rgba(209, 64, 9, 0.5),
        0 0 0 20px rgba(209, 64, 9, 0.5), 0 0 0 40px rgba(209, 64, 9, 0.25),
        0 0 0 60px rgba(209, 64, 9, 0.13), 0 0 0 80px rgba(209, 64, 9, 0.06),
        0 0 40px 100px rgba(209, 64, 9, 0.06);
    }
    100% {
      box-shadow: 0 0 0 20px rgba(209, 64, 9, 0.5),
        0 0 0 40px rgba(209, 64, 9, 0.25), 0 0 0 60px rgba(209, 64, 9, 0.13),
        0 0 0 80px rgba(209, 64, 9, 0.06), 0 0 0 100px rgba(209, 64, 9, 0),
        0 0 40px 100px rgba(209, 64, 9, 0.06);
    }
  }
`;

const EyeOfSauronWrapperProps = (props) =>
  !props.isOn &&
  `
   display: none;
`;
const EyeOfSauronWrapper = styled.div`
  ${EyeOfSauronWrapperProps}
  position: fixed;
  top: 20%;
  left: calc(50% - 250px);
  z-index: 25;
  border-radius: 100%;
`;

const RingWrapperProps = (props) =>
  !props.isOn &&
  `
    path:nth-of-type(2) {
      fill: #e8ac17;
    }

`;
const RingWrapper = styled.div`
  position: absolute;
  bottom: 5%;
  display: flex;
  width: 100%;
  justify-content: center;
  z-index: 100;
  button {
    background-color: white;
    color: black;
    border-radius: 15px;
    padding: 4px;
    vertical-align: middle;
    border: 1px solid black;
    z-index: 2;
    :hover {
      cursor: pointer;
      background-color: red;
    }
  }

  svg {
    vertical-align: middle;
    width: 1.7rem;
    height: 1.7rem;
  }
  ${RingWrapperProps}
`;
