export function getRandomIntBetween(min, max) {
  max -= 1;
  return Math.floor(Math.random() * (max - min + 1) + min) + 1;
}

export function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
