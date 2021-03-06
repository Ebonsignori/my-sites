import { createGlobalStyle } from "styled-components";

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
`;

export default GlobalStyle;
