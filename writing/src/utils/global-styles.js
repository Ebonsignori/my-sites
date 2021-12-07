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
    --secondary: #B66D0D;
    --primary: #2F9C95;
    --background-accent: #CFCCCC;
    --background: #FFFFFF;
  }

  body {
    background: var(--background);
    color: var(--font);
    margin: 0;
    padding: 0;
    font-family: 'Raleway', sans-serif;
  }

  a {
    font-family: 'Raleway', sans-serif;
    text-decoration: none;
    ${linkStyles}
  }

  div,
  span,
  p,
  input,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Raleway', sans-serif;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
      outline: none;
  }
`;

export default GlobalStyle;
