// Capitalize first letter of string
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Capitalize each word in string
export function capitalizeAll(str, splitOn = " ") {
  return str.split(splitOn).map(capitalize).join(" ");
}

// Is string a numeric string
export function isNumeric(value) {
  return /^\d+$/.test(value);
}

export function csvToArray(array, shouldLowercase = true) {
  return array
    .split(", ")
    .map((x) => (shouldLowercase ? x.toLowerCase().trim() : x.trim()));
}

export function arrayToCSV(array, shouldCapitalize = true) {
  return array.map(
    (item, index) =>
      `${shouldCapitalize ? capitalizeAll(item) : item}${
        index !== array.length - 1 ? ", " : ""
      }`
  );
}
