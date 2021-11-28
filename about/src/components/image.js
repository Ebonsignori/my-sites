import styled from "styled-components";

export default function Image({ src, alt, width, height }) {
  const source = getImageSource(src);

  return <StyledImage src={source} alt={alt} height={height} width={width} />;
}

export function getImageSource(src) {
  let source = "";
  if (process.env.NODE_ENV !== "development") {
    source = `https://ebonsignori.github.io/my-about/images/${src}`;
  } else {
    src = `/images/${src}`;
  }

  return source;
}

const StyledImage = styled.img``;
