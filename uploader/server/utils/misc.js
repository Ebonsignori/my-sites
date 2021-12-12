// Transforms CSV array into trimmed JS array. E.g. "dog, cat, alien" becomes ["dog", "cat", "alien"]
function csvStrToArray(
  stringOrEnvVar,
  lowercaseItems = false,
  filterOutEmpty = false
) {
  const stringArr = process.env[stringOrEnvVar]
    ? process.env[stringOrEnvVar]
    : stringOrEnvVar;
  const result = stringArr
    .split(",")
    .map((item) => (lowercaseItems ? item.trim().toLowerCase() : item.trim()));
  if (filterOutEmpty) {
    return result.filter((x) => x);
  }
  return result;
}

module.exports = { csvStrToArray };
