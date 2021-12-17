export function isValidDate(date) {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
}

// eslint-disable-next-line no-useless-escape
const shortDateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
export function isShortDateString(dateStr) {
  return shortDateRegex.test(dateStr);
}

export function toReadableDateString(date) {
  if (!isValidDate(date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
}
