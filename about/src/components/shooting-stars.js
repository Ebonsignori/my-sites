import { memo, useMemo, useState } from "react";
import styled from "styled-components";

import { getRandomStarProps } from "../utils/star-helpers";

const initialStars = getRandomStarProps();
const initialAnimations = initialStars.map(() => false);

export default memo(function ShootingStars() {
  const [starProps, setStarProps] = useState(initialStars);
  const [animationsDone, setAnimationsDone] = useState(initialAnimations);

  if (animationsDone.every((el) => el === true)) {
    const newStars = getRandomStarProps();
    const newAnimations = newStars.map(() => false);
    setStarProps(newStars);
    setAnimationsDone(newAnimations);
  }

  const Stars = useMemo(
    () =>
      starProps.map((star) => {
        return (
          <StarWrapper key={star.uid} rotateDeg={star.rotateDeg}>
            <StyledShootingStar
              {...star}
              onAnimationEnd={(e) => {
                if (e.animationName === "shooting") {
                  setAnimationsDone((prevAnimations) => {
                    const newAnimations = [...prevAnimations];
                    newAnimations[star.index] = true;
                    return newAnimations;
                  });
                }
              }}
            />
          </StarWrapper>
        );
      }),
    [starProps]
  );

  return Stars;
});

const StarWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  transform: rotateZ(${(props) => props.rotateDeg}deg);
  z-index: 0;
`;

const StyledShootingStar = styled.div`
  position: absolute;
  left: ${(props) => props.startLeft}%;
  top: ${(props) => props.startTop}%;
  height: 2px;
  background: linear-gradient(
    -45deg,
    rgba(95, 145, 255, 1),
    rgba(0, 0, 255, 0)
  );
  border-radius: 999px;
  filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
  animation: tail ${(props) => props.duration} ease-in-out 1,
    shooting ${(props) => props.duration} ease-in-out 1;
  animation-delay: ${(props) => props.delay}ms;

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
    animation: shining ${(props) => props.duration} ease-in-out 1;
    animation-delay: ${(props) => props.delay}ms;
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
    animation: shining ${(props) => props.duration} ease-in-out 1;
    animation-delay: ${(props) => props.delay}ms;
    transform: translateX(50%) rotateZ(-45deg);
  }

  @keyframes tail {
    0% {
      width: 0;
    }

    30% {
      width: ${(props) => props.shotLength}vw;
    }

    100% {
      width: 0;
    }
  }

  @keyframes shining {
    0% {
      width: 0;
    }

    50% {
      width: 30px;
    }

    100% {
      width: 0;
    }
  }

  @keyframes shooting {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(${(props) => props.shotLength * 3}vw);
    }
  }

  @keyframes sky {
    0% {
      transform: rotate(45deg);
    }

    100% {
      transform: rotate(45 + 360deg);
    }
  }
`;
