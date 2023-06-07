import { BREAKPOINTS } from "../utils/breakpoints";

export function getImageSetSrc(name, isAsset = false, prefixFolder) {
  let srcSetStr = "";
  for (const breakpoint of BREAKPOINTS) {
    srcSetStr += `${getImageSource(
      name,
      breakpoint,
      isAsset,
      prefixFolder
    )} ${breakpoint}w, `;
  }
  // Remove last ", "
  srcSetStr = srcSetStr.substring(0, srcSetStr.length - 2);
  return srcSetStr;
}

export function getImageSource(
  name,
  breakpoint,
  isAsset = false,
  prefixFolder = ""
) {
  let baseUrl = process.env.BASE_PHOTO_URL;
  if (isAsset) {
    baseUrl = process.env.BASE_ASSET_URL;
  }
  let folderPart = `${baseUrl}/${name}`;
  if (prefixFolder) {
    folderPart = `${baseUrl}/${prefixFolder}/${name}`;
  }
  let source = `${folderPart}/${name}-original.jpeg`;
  if (breakpoint) {
    source = `${folderPart}/${name}-${breakpoint}.webp`;
  }
  return source;
}

export function responsiveBackgroundImageUrl(name, isAsset, prefixFolder) {
  let imageUrl = getImageSource(name, BREAKPOINTS[0], isAsset, prefixFolder);
  let cssStr = `
      @media (max-width: ${BREAKPOINTS[0]}px) {
        background-image: url("${imageUrl}");
      }
  `;
  for (let i = 0; i < BREAKPOINTS.length - 1; i++) {
    const maxWidth = BREAKPOINTS[i + 1];
    const minWidth = BREAKPOINTS[i] + 1;
    imageUrl = getImageSource(name, maxWidth, isAsset, prefixFolder);
    cssStr += `
      @media (max-width: ${maxWidth}px) and (min-width: ${minWidth}px) {
        background-image: url("${imageUrl}");
      }
    `;
  }
  const lastBreakpointImage = getImageSource(
    name,
    BREAKPOINTS[BREAKPOINTS.length - 1],
    isAsset,
    prefixFolder
  );
  cssStr += `
      background-image: url("${lastBreakpointImage}");
    `;

  return cssStr;
}

/* eslint-disable max-len */
const PNG_BREAKPOINT_MAP = {
  [BREAKPOINTS[0]]:
    "iVBORw0KGgoAAAANSUhEUgAAAlgAAABaCAQAAADOOOB1AAAA+UlEQVR42u3UMQ0AAAgEMV450sEEC0kr4YbLdAG8EMMCDAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLMCwDAswLADDAgwLwLAADAswLADDAjAswLAADAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAMMSATAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLADDAgwLwLAAwwIwLIBLC3L8hqe1sN8MAAAAAElFTkSuQmCC",
  [BREAKPOINTS[1]]:
    "iVBORw0KGgoAAAANSUhEUgAAAlgAAABaCAQAAADOOOB1AAAA+UlEQVR42u3UMQ0AAAgEMV450sEEC0kr4YbLdAG8EMMCDAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLMCwDAswLADDAgwLwLAADAswLADDAjAswLAADAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAMMSATAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLADDAgwLwLAAwwIwLIBLC3L8hqe1sN8MAAAAAElFTkSuQmCC",
  [BREAKPOINTS[2]]:
    "iVBORw0KGgoAAAANSUhEUgAAAlgAAABaCAQAAADOOOB1AAAA+UlEQVR42u3UMQ0AAAgEMV450sEEC0kr4YbLdAG8EMMCDAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLMCwDAswLADDAgwLwLAADAswLADDAjAswLAADAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAMMSATAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLADDAgwLwLAAwwIwLIBLC3L8hqe1sN8MAAAAAElFTkSuQmCC",
  [BREAKPOINTS[3]]:
    "iVBORw0KGgoAAAANSUhEUgAAAlgAAABaCAQAAADOOOB1AAAA+UlEQVR42u3UMQ0AAAgEMV450sEEC0kr4YbLdAG8EMMCDAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLMCwDAswLADDAgwLwLAADAswLADDAjAswLAADAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAMMSATAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLADDAgwLwLAAwwIwLIBLC3L8hqe1sN8MAAAAAElFTkSuQmCC",
  [BREAKPOINTS[4]]:
    "iVBORw0KGgoAAAANSUhEUgAAAlgAAABaCAQAAADOOOB1AAAA+UlEQVR42u3UMQ0AAAgEMV450sEEC0kr4YbLdAG8EMMCDAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLMCwDAswLADDAgwLwLAADAswLADDAjAswLAADAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAMMSATAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLADDAgwLwLAAwwIwLIBLC3L8hqe1sN8MAAAAAElFTkSuQmCC",
  [BREAKPOINTS[5]]:
    "iVBORw0KGgoAAAANSUhEUgAAAlgAAABaCAQAAADOOOB1AAAA+UlEQVR42u3UMQ0AAAgEMV450sEEC0kr4YbLdAG8EMMCDAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLMCwDAswLADDAgwLwLAADAswLADDAjAswLAADAvAsADDAjAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAMMSATAsAMMCDAvAsAAMCzAsAMMCMCzAsAAMC8CwAMMCMCwAwwIMC8CwAAwLMCwAwwIwLMCwAAwLwLAAwwIwLADDAgwLwLAAwwIwLIBLC3L8hqe1sN8MAAAAAElFTkSuQmCC",
};
/* eslint-enable max-len */

// Transparent pngs at each breakpoint
export function getPlaceholderSetSrc() {
  let srcSetStr = "";
  for (const breakpoint of BREAKPOINTS) {
    srcSetStr += `data:image/png;base64,${PNG_BREAKPOINT_MAP[breakpoint]} ${breakpoint}w, `;
  }
  // Remove last ", "
  srcSetStr = srcSetStr.substring(0, srcSetStr.length - 2);
  return srcSetStr;
}
