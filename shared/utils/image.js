import { BREAKPOINTS } from "../utils/breakpoints";

export function getImageSetSrc(name, isAsset) {
  let srcSetStr = "";
  for (const breakpoint of BREAKPOINTS) {
    srcSetStr += `${getImageSource(
      name,
      breakpoint,
      isAsset
    )} ${breakpoint}w, `;
  }
  // Remove last ", "
  srcSetStr = srcSetStr.substring(0, srcSetStr.length - 2);
  return srcSetStr;
}

export function getImageSource(name, breakpoint, isAsset = false) {
  let baseUrl = process.env.BASE_PHOTO_URL;
  if (isAsset) {
    baseUrl = process.env.BASE_ASSET_URL;
  }
  let source = `${baseUrl}/${name}/${name}-original.jpg`;
  if (breakpoint) {
    source = `${baseUrl}/${name}/${name}-${breakpoint}.jpg`;
  }
  return source;
}

export function responsiveBackgroundImageUrl(name, isAsset) {
  let cssStr = `
      @media screen and (max-width: ${BREAKPOINTS[0]}px) {
        background-image: url(${getImageSource(name, BREAKPOINTS[1], isAsset)});
      }
  `;
  for (let i = 1; i < BREAKPOINTS.length - 1; i++) {
    const maxWidth = BREAKPOINTS[i + 1];
    const minWidth = BREAKPOINTS[i] + 1;
    cssStr += `
      @media screen and (max-width: ${maxWidth}px) and (min-width: ${minWidth}px) {
        background-image: url(${getImageSource(name, maxWidth, isAsset)});
      }
    `;
    cssStr += `
      background-image: url("${getImageSource(name, "original", isAsset)}");
    `;
  }
  return cssStr;
}
