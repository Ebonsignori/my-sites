import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --font: #ffffff;
    --font-secondary: #666;
    --font-trinary: #999;
    --accent: #5f91ff;
    --background: #000000;

    --heading-family: "Merriweather";
    --body-family: "Raleway";
  }

  body {
    background-color: var(--background);
    margin: 0;
    padding: 0;
    font-family: var(--body-family), sans-serif;
  }

  a,
  strong,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--heading-family), sans-serif;
  }
`;

export default GlobalStyle;
