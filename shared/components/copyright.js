import { memo } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../utils/breakpoints";

function Copyright() {
  const year = new Date().getFullYear();
  return (
    <Footer>
      <Text>
        Copyright <a href={process.env.ABOUT_PAGE_URL}>Evan Bonsignori</a>{" "}
        {year}
      </Text>
    </Footer>
  );
}

const Footer = styled.footer`
  display: flex;
  justify-content: center;
`;

const TextBreakpoints = setEachBreakpoint({
  lg: `
  font-size: 1.1rem;
  `,
  xl: `
  font-size: 1.5rem;
  `,
  xxl: `
  font-size: 1.5rem;
  `,
});
const Text = styled.p`
  margin: 2rem;
  text-align: center;
  font-weight: 200;
  color: var(--font-secondary);
  ${TextBreakpoints}

  a {
    color: var(--secondary);
    :hover {
      color: var(--primary);
    }
  }
`;

export default memo(Copyright);
