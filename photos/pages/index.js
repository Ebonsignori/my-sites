import styled from "styled-components";

export default function Home() {
  return (
    <PageWrapper>
      <PreviewWrapper>
        <h1>Coming Soon</h1>
        <p>
          Back to <a href="https://evan.bio">evan.bio</a>
        </p>
      </PreviewWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  color: black;
`;

const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;

  h1 {
    font-size: 8em;
  }

  p {
    font-size: 3em;
  }

  a {
    :hover {
      opacity: 0.7;
    }
  }
`;
