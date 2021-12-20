import fs from "fs";
import path from "path";

const geoJsonPath = path.join(
  process.cwd(),
  "src/components/globe/countries.geojson"
);
export function fetchGeoJson() {
  console.log(geoJsonPath)
  console.log(fs.readFileSync(geoJsonPath, "utf8"))
  const geoJson = JSON.parse();
  if (!geoJson) {
    throw new Error("Geojson missing or path incorrect.");
  }
}
