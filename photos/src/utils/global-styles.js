import { createGlobalStyle } from "styled-components";

import {
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
} from "../../../shared/utils/breakpoints";
export const linkStyles = `
  color: var(--primary);
  :hover {
    cursor: pointer;
    color: var(--secondary);
  }
`;

const GlobalStyle = createGlobalStyle`
  :root {
    --font: #000000;
    --font-secondary: #685F74;
    --primary: #B66D0D;
    --secondary: #2F9C95;
    --background-accent: #CFCCCC;
    --background: #FFFFFF;

    --main-family: "Raleway";
    --accent-family: "Merriweather";
  }

  body {
    background: var(--background);
    color: var(--font);
    margin: 0;
    padding: 0;
    font-family: var(--accent-family), sans-serif;
    font-weight: 300;
  }

  a {
    font-family: var(--accent-family), sans-serif;
    text-decoration: none;
    ${linkStyles}
  }

  input,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--main-family), sans-serif;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
      outline: none;
  }

  .tooltip {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tooltip .tooltip-text {
    visibility: hidden;
    width: fit-content;
    padding: 6px 1.2vw;
    background-color: var(--font-secondary);
    color: var(--background);
    text-align: center;
    border-radius: 15px;
   
    position: absolute;
    z-index: 1;
    ${BREAKPOINT_LG} {
      top: -47px;
    }
    ${BREAKPOINT_XL} {
      top: -52px;
    }
    ${BREAKPOINT_XXL} {
      top: -57px;
    }
    top: -45px;
    transition: .3s opacity;
    opacity: 0;
    white-space: nowrap;

    border-bottom: 2px solid var(--font-secondary);
    :after {
      content:'';
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 0;
      height: 0;
      border-top: 10px solid var(--font-secondary);
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
    }
  }

  .tooltip:hover {
    .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  }
`;

export default GlobalStyle;
