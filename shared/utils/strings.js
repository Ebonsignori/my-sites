// Capitalize first letter of string
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Capitalize each word in string
export function capitalizeAll(str, splitOn = " ") {
  return str.split(splitOn).map(capitalize).join(" ");
}
