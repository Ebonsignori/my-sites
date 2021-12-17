import { memo } from "react";
import styled from "styled-components";

function Copyright() {
  const year = new Date().getFullYear();
  return (
    <Text>
      Copyright <a href={process.env.ABOUT_PAGE_URL}>Evan Bonsignori</a> {year}
    </Text>
  );
}

const Text = styled.footer`
  margin: 2rem;
  text-align: center;
  font-weight: 200;
  color: var(--font-secondary);
`;

export default memo(Copyright);
