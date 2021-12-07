export function isValidDate(date) {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
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
