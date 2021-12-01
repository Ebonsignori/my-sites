import fs from "fs";
import path from "path";

export default function fetchContent() {
  const contentPath = path.join(process.cwd(), "content.json");
  return JSON.parse(fs.readFileSync(contentPath, "utf8"));
}
