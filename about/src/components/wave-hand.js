import styled from "styled-components";

import WaveIcon from "../svgs/wave";

export default function WaveHand({ introLoadFinished }) {
  return <StyledWaveIcon wave={!introLoadFinished} />;
}

const StyledWaveIcon = styled(WaveIcon)`
  z-index: 4;
  min-width: 1em;
  visibility: visible;
  path {
    fill: white;
  }
  ${(props) =>
    props.wave &&
    `
    animation-name: wave-animation; 
  `}
  :hover {
    animation-name: wave-animation;
  }
  animation-duration: 2s;
  animation-iteration-count: 1;
  transform-origin: 90% 90%;

  @keyframes wave-animation {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(12deg);
    }
    60% {
      transform: rotate(-2deg);
    }
    80% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
