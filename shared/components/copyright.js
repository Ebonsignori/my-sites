import { memo, useMemo } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../utils/breakpoints";

function Copyright({ invertColors }) {
  const year = new Date().getFullYear();
  const copywriteText = useMemo(() => {
    if (!invertColors) {
      return (
        <>
          {" "}
          Copyright <a href={process.env.ABOUT_PAGE_URL}>
            Evan Bonsignori
          </a>{" "}
        </>
      );
    }
    return (
      <>
        Copyright <strong>Evan Bonsignori</strong>{" "}
      </>
    );
  }, [invertColors]);

  return (
    <Footer invertColors={invertColors}>
      <Text>
        {copywriteText}
        {year}
      </Text>
    </Footer>
  );
}

const FooterProps = (props) =>
  props.invertColors &&
  `
  background-color: var(--font);

`;
const Footer = styled.footer`
  display: flex;
  justify-content: center;
  ${FooterProps}
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

const TextProps = (props) =>
  props.invertColors &&
  `
  color: var(--background);
`;
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
  ${TextProps}
`;

export default memo(Copyright);
