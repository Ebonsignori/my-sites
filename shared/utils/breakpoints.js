export const BREAKPOINTS = [600, 900, 1200, 1800, 2500, 3000];

export const BREAKPOINT_XS = `@media (max-width: ${BREAKPOINTS[0]}px)`;
export const BREAKPOINT_SM = `@media (max-width: ${
  BREAKPOINTS[1]
}px) and (min-width: ${BREAKPOINTS[0] + 1}px)`;
export const BREAKPOINT_MD = `@media (max-width: ${
  BREAKPOINTS[2]
}px) and (min-width: ${BREAKPOINTS[1] + 1}px)`;
export const BREAKPOINT_LG = `@media (max-width: ${
  BREAKPOINTS[3]
}px) and (min-width: ${BREAKPOINTS[2] + 1}px)`;
export const BREAKPOINT_XL = `@media (max-width: ${
  BREAKPOINTS[4]
}px) and (min-width: ${BREAKPOINTS[3] + 1}px)`;
// Anything past 2500
export const BREAKPOINT_XXL = `@media (min-width: ${BREAKPOINTS[4] + 1}px)`;

const BREAKPOINT_KEY_MAP = {
  xs: BREAKPOINT_XS,
  sm: BREAKPOINT_SM,
  md: BREAKPOINT_MD,
  lg: BREAKPOINT_LG,
  xl: BREAKPOINT_XL,
  xxl: BREAKPOINT_XXL,
};

export function setEachBreakpoint(
  args = {
    xs: "",
    sm: "",
    md: "",
    lg: "",
    xl: "",
    xxl: "",
  }
) {
  let cssString = "";
  for (const key of Object.keys(args)) {
    cssString += `
${BREAKPOINT_KEY_MAP[key]} {
  ${args[key]}
}
    `;
  }
  return cssString;
}
