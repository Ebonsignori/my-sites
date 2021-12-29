import "react-lazy-load-image-component/src/effects/blur.css";

import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";

import AppContext from "../../../shared/utils/app-context";
import { getImageSetSrc } from "../../../shared/utils/image";

export default function Figure({ image, caption, imageAlt, priority }) {
  if (!image?.includes("://")) {
    image = getImageSetSrc(image, true, "writing");
  }
  const appState = useContext(AppContext);
  const modalContents = (
    <img
      srcSet={image}
      alt={imageAlt}
      width="100%"
      onClick={() => {
        appState.setModalContents();
      }}
    />
  );
  let ImageComponent = LazyLoadImage;
  if (priority) {
    ImageComponent = function ImageFigure(props) {
      return <img {...props} />;
    };
  }
  return (
    <>
      <ImageContainer
        key={image}
        onClick={() => {
          appState.setModalContents(modalContents);
        }}
      >
        <ImageComponent
          effect="blur"
          srcSet={image}
          alt={imageAlt}
          width="100%"
          height="100%"
        />
        {caption && <ImageCaption>{caption}</ImageCaption>}
      </ImageContainer>
    </>
  );
}

const ImageContainer = styled.figure`
  margin-right: 0;
  margin-left: 0;
  margin-bottom: 0;
  max-width: 100%;
  :hover {
    cursor: zoom-in;
  }
`;

const ImageCaption = styled.figcaption`
  text-align: center;
  color: var(--font-secondary);
  font-weight: 100;
`;
