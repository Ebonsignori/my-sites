import { getRandomIntBetween } from "./random";

const MAX_STARS = 6;
const MAX_TRAVEL_TIME = 7;
const MAX_DELAY_BETWEEN_STARS = 3000;

export function getRandomStarProps() {
  const numberOfStars = getRandomIntBetween(1, MAX_STARS);
  const starProps = [];

  for (let i = 0; i < numberOfStars; i++) {
    const uid = `${new Date().getTime() + Math.random()}${i}`;
    const shootingTime = getRandomIntBetween(0, MAX_TRAVEL_TIME);
    const duration = `${shootingTime}s`;
    const startTop = getRandomIntBetween(0, 50);
    const startLeft = getRandomIntBetween(0, 50);
    // Length in vw, total tail travel is length * 3. e.g. 30vw, 90vw travel
    const shotLength = getRandomIntBetween(5, 50);
    const rotateDeg = getRandomIntBetween(1, 359);
    const delay = getRandomIntBetween(1, MAX_DELAY_BETWEEN_STARS);
    starProps.push({
      uid,
      index: i,
      numberOfStars,
      startTop,
      startLeft,
      shootingTime,
      shotLength,
      rotateDeg,
      duration,
      delay,
    });
  }

  return starProps;
}
