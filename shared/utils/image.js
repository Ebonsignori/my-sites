import { BREAKPOINTS } from "../utils/breakpoints";

export function getImageSetSrc(name, isAsset, prefixFolder) {
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
  let source = `${folderPart}/${name}-original.jpg`;
  if (breakpoint) {
    source = `${folderPart}/${name}-${breakpoint}.webp`;
  }
  return source;
}

export function responsiveBackgroundImageUrl(name, isAsset) {
  let cssStr = `
      @media (max-width: ${BREAKPOINTS[0]}px) {
        background-image: url(${getImageSource(name, BREAKPOINTS[1], isAsset)});
      }
  `;
  for (let i = 0; i < BREAKPOINTS.length - 1; i++) {
    const maxWidth = BREAKPOINTS[i + 1];
    const minWidth = BREAKPOINTS[i] + 1;
    cssStr += `
      @media (max-width: ${maxWidth}px) and (min-width: ${minWidth}px) {
        background-image: url(${getImageSource(name, maxWidth, isAsset)});
      }
    `;
  }
  const lastBreakpointImage = getImageSource(
    name,
    BREAKPOINTS[BREAKPOINTS.length - 1],
    isAsset
  );
  cssStr += `
      background-image: url("${lastBreakpointImage}");
    `;

  return cssStr;
}
