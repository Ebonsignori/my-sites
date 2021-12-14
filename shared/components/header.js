import styled from "styled-components";

export default function Header({ title, subtitle }) {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: row;
`;

const Title = h1``
