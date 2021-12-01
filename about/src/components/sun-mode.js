import { useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import { getRandomIntBetween } from "../utils/random";

const MAX_STARS = 200;

const distances = {};

let musicPlaying = false;

export default function SunMode() {
  const [numberOfStars, setNumberOfStars] = useState(0);
  const onRemoveStar = () => {
    if (numberOfStars > -1) {
      setNumberOfStars((prevCount) => prevCount - 1);
    }
  };
  const onAddStar = () => {
    if (numberOfStars < MAX_STARS) {
      setNumberOfStars((prevCount) => prevCount + 1);
    }
  };
  // eslint-disable-next-line prefer-spread
  const CirclingStars = Array.apply(null, { length: numberOfStars }).map(
    (a, index) => {
      let randomDistance = distances[index];
      if (!randomDistance) {
        distances[index] = getRandomIntBetween(0, 25);
      }
      randomDistance = distances[index];
      return (
        <StarSpinner key={`star-${index}`} distance={randomDistance}>
          <CirclingStar />
        </StarSpinner>
      );
    }
  );

  if (typeof window !== "undefined" && !musicPlaying && numberOfStars >= 10) {
    musicPlaying = true;
    const audio = new Audio(
      "https://evan-bio-assets.s3.amazonaws.com/shooting-stars-loop.mp3"
    );
    audio.loop = true;
    audio.play();
  }

  let ChangeSectionRender = (
    <>
      <ChangeCountRow>
        <AddRemoveStar onClick={onRemoveStar}>-</AddRemoveStar>
        <StarCount>{numberOfStars} Stars</StarCount>
        <AddRemoveStar onClick={onAddStar}>+</AddRemoveStar>
      </ChangeCountRow>
    </>
  );
  if (numberOfStars >= MAX_STARS) {
    ChangeSectionRender = (
      <p>
        Ok, ok, if you want to keep being entertained,{" "}
        <a href="https://www.youtube.com/playlist?list=PLFsQleAWXsj_4yDeebiIADdH5FMayBiJo">
          go here.
        </a>
      </p>
    );
  }

  return (
    <>
      <StarsWrapper>{CirclingStars}</StarsWrapper>
      <ChangeCountSection>{ChangeSectionRender}</ChangeCountSection>
      <SunWrapper>
        <SunImage numberOfStars={numberOfStars} />
        <Sun />
      </SunWrapper>
    </>
  );
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
  ${setEachBreakpoint({
    xs: `
      height: 5em;
      width: 5em;
     `,
    sm: `
      height: 7em;
      width: 7em;
     `,
  })}
  ${(props) => {
    const { numberOfStars } = props;
    let imageUrl;

    const isBetween = (start, end) =>
      numberOfStars >= start && numberOfStars < end;

    if (numberOfStars < 0) {
      // Excuse me
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1589877402/9116/excuseme.gif?1589877402";
    } else if (isBetween(1, 3)) {
      // Neutral blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1572027761/6878/blob_neutral.png?1572027761";
    } else if (isBetween(3, 5)) {
      // Vibrating neutral blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1629848413/49026/neutral_blob_vibrating.gif?1629848413";
    } else if (isBetween(5, 8)) {
      // Smile blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1572027834/6910/blob_smile.png?1572027834";
    } else if (isBetween(8, 10)) {
      // Hype blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1584725500/8268/blob-hype.gif?1584725500";
    } else if (isBetween(10, 15)) {
      // Bongo blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1562883039/5948/bongo_blob.gif?1562883039";
    } else if (isBetween(15, 20)) {
      // Dance blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1547582922/5197/party_blob.gif?1547582922";
    } else if (isBetween(20, 25)) {
      // Fast dance blob
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1627571184/48081/hyper_blob-dance.gif?1627571184";
    } else if (isBetween(25, 30)) {
      // Cat jam
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1597320283/10003/catjam.gif?1597320283";
    } else if (isBetween(30, 35)) {
      // Cool doge
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1520808873/3643/cool-doge.gif?1520808873";
    } else if (isBetween(35, 40)) {
      // Stonks rainbow
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1632358912/49550/stonkazoid.gif?1632358912";
    } else if (isBetween(40, 45)) {
      // Friday dog
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1625751875/47107/friday_dog.gif?1625751875";
    } else if (isBetween(45, 50)) {
      // Walk bear
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1518311667/3526/walkbear.gif?1518311667";
    } else if (isBetween(50, 55)) {
      // Celebrate
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1638293377/50392/celebrate-inclusive-party.gif?1638293377";
    } else if (isBetween(55, 60)) {
      // Banana Dance
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1450694616/220/bananadance.gif?1450694616";
    } else if (isBetween(60, 65)) {
      // Blob flail dance
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1584726180/8270/blob-dance.gif?1584726180";
    } else if (isBetween(65, 70)) {
      // Rick n roll dance
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1539890226/4845/rickroll.gif?1539890226";
    } else if (isBetween(70, 75)) {
      // Among us
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1605479308/11044/among_us_yellow.png?1605479308";
    } else if (isBetween(75, 80)) {
      // Among us eject
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1613270271/12726/space_float.gif?1613270271";
    } else if (isBetween(80, 85)) {
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1572027841/6924/blob_stop.png?1572027841";
    } else if (isBetween(85, 90)) {
      // Kekwtf
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1633720986/49815/kekwtf.png?1633720986";
    } else if (isBetween(90, 95)) {
      // Awkward
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1599212740/10402/awkward_monkey_look.gif?1599212740";
    } else if (isBetween(95, 100)) {
      // Panic
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1558099591/5711/ahhhhhhhhh.gif?1558099591";
    } else if (isBetween(100, 110)) {
      // Pika - oh
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1555780768/5641/surprised-pikachu.png?1555780768";
    } else if (isBetween(110, 125)) {
      // This is fine
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1628546365/48515/thisisfine.gif?1628546365";
    } else if (isBetween(125, 140)) {
      // Elmo fire
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1579644131/7581/elmofire.gif?1579644131";
    } else if (isBetween(140, 160)) {
      // Mind Explosion
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1497901371/2453/alert.gif?1497901371";
    } else if (isBetween(160, 185)) {
      // Mind Explosion
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1511398636/3220/mind-explosion.gif?1511398636";
    } else if (isBetween(185, 200)) {
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1572027745/6841/blob_dead.png?1572027745";
    } else if (numberOfStars === 200) {
      imageUrl =
        "https://emojis.slackmojis.com/emojis/images/1620204659/35978/flowey_undertale.png?1620204659";
    }

    return `
        background-image: url("${imageUrl}")
      `;
  }}
`;

const StarsWrapper = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StarSpinner = styled.div`
  position: absolute;
  display: flex;
  justify-items: flex-end;
  justify-content: flex-end;
  width: ${(props) => props.distance + 37}vw;
  ${(props) => setEachBreakpoint({
    xs: `
      width: ${props.distance + 65}vw;
     `,
    sm: `
      width: ${props.distance + 55}vw;
     `,
    md: `
      width: ${props.distance + 55}vw;
     `,
    xl: `
      width: ${props.distance + 30}vw;
    `
  })}

  animation: spin 10s linear infinite forwards;
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CirclingStar = styled.div`
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

  ${setEachBreakpoint({
    xs: `
      width: 10vw;
     `,
    sm: `
      width: 7vw;
     `,
    md: `
      width: 5vw;
     `,
  })}


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

const ChangeCountRow = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 5em;
  width: 35vw;
  justify-content: space-evenly;
  ${setEachBreakpoint({
    xs: `
      margin-top: 15%;
      font-size: 3em;
      width: 80vw;
     `,
    sm: `
      margin-top: 10%;
      width: 55vw;
     `,
    md: `
      width: 45vw;
      `,
  })}
`;

const StarCount = styled.div``;

const AddRemoveStar = styled.div`
  font-size: 1em;
  user-select: none;
  :hover {
    cursor: pointer;
    opacity: 0.9;
    color: lightblue;
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

const Sun = styled.div`
  height: 10em;
  width: 10em;
  border-radius: 100%;
  z-index: 1;
  opacity: 0;

  ${setEachBreakpoint({
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
  })}

  animation: sun-glow 10s linear infinite,
    sunrise 2s infinite linear forwards,
  rays 2s 2s infinite linear,
  fadeInAnimation ease 3s forwards;

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
