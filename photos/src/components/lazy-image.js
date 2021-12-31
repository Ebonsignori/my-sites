import { memo, useEffect, useMemo, useState } from "react";
import { SpinnerDotted } from "spinners-react";
import styled from "styled-components";

import { getPlaceholderSetSrc } from "../../../shared/utils/image";

// More like a Loading image, not actually lazy-loaded
function LazyImage(props) {
  const [loaded, setLoaded] = useState(false);

  const imageProps = useMemo(() => {
    const placeHolderProps = {
      srcSet: getPlaceholderSetSrc(),
      height: props.tall ? "100%" : props.height,
      width: props.tall ? "auto" : props.width,
      alt: "Transparent placeholder image",
    };
    if (props.loadingSize) {
      placeHolderProps.height = props.loadingSize;
      placeHolderProps.width = props.loadingSize;
    }
    const loadedProps = {
      src: props.src,
      srcSet: props.srcSet,
      height: props.height,
      width: props.width,
      alt: props.alt,
    };

    if (props.index > 5) {
      loadedProps.loading = "lazy";
    }

    if (loaded) {
      return loadedProps;
    }
    return placeHolderProps;
  }, [loaded, props]);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setLoaded(true);
    };
    image.srcset = props.srcSet;

    return () => {
      image.onload = null;
    };
  }, [props.srcSet]);

  return (
    <>
      <LoadingWrapper
        key={`loader-${imageProps.src}`}
        style={{
          display: loaded ? "none" : "flex",
        }}
      >
        <SpinnerDotted
          enabled={!loaded}
          style={{
            width: "25%",
            height: "25%",
            color: "var(--secondary)",
          }}
        />
      </LoadingWrapper>
      <StyledImage {...imageProps} />
    </>
  );
}

export default memo(LazyImage);

const LoadingWrapper = styled.div`
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 2;
  border-radius: 5px;
`;

const StyledImage = styled.img`
  position: relative;
  user-select: none;
  vertical-align: middle;
  display: inline-block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  z-index: 1;
`;
