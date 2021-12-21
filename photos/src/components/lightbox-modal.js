import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { saveAs } from "file-saver";
import Link from "next/link";
import Router from "next/router";
import { memo, useCallback, useMemo } from "react";
import styled from "styled-components";

import LazyImage from "../../../shared/components/lazy-image";
import DateIcon from "../../../shared/svgs/date-icon";
import LeftArrow from "../../../shared/svgs/left-arrow";
import RightArrow from "../../../shared/svgs/right-arrow";
import TagIcon from "../../../shared/svgs/tag-icon";
import {
  BREAKPOINT_LG,
  BREAKPOINT_MD,
  BREAKPOINT_SM,
  BREAKPOINT_XL,
  BREAKPOINT_XS,
  setEachBreakpoint,
} from "../../../shared/utils/breakpoints";
import { toReadableDateString } from "../../../shared/utils/dates";
import { getImageSetSrc, getImageSource } from "../../../shared/utils/image";
import { capitalizeAll } from "../../../shared/utils/strings";
import CameraIcon from "../svgs/camera-icon";
import DownloadIcon from "../svgs/download-icon";
import LocationIcon from "../svgs/location-icon";

function LightboxModal({
  images,
  imageName,
  setSelectedImageName,
  supportsWebp,
  refreshOnSelect,
}) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  let image = {};
  if (imageName) {
    image = images[imageName];
  }

  const bind = useDrag(
    ({ down, movement: [mx], active }) => {
      if (!active) {
        setSelectedImageName(image.prev);
        mx = 0;
      } else if (!active) {
        setSelectedImageName(image.next);
        mx = 0;
      }
      api.start({
        x: down ? mx : 0,
      });
    },
    { bounds: { left: -100, right: 100 }, delay: 2000, threshold: 200 }
  );

  const closeModal = useCallback(() => {
    setSelectedImageName("");
  }, [setSelectedImageName]);

  const ImageRender = useMemo(() => {
    if (!image || !image.name) {
      return null;
    }
    let imageUrl = getImageSetSrc(image.name);
    if (!supportsWebp) {
      imageUrl = getImageSource(image.name);
    }
    const getTagUrl = (tagName) =>
      tagName ? `/?tags=${tagName?.toLowerCase()}` : "";
    const getModelUrl = (modelName) =>
      modelName ? `/?models=${modelName?.toLowerCase()}` : "";
    const orientationProps = {};
    if (image?.orientation === "tall") {
      orientationProps.height = "100%";
    } else if (image?.orientation === "wide") {
      orientationProps.width = "100%";
    } else {
      orientationProps.height = "100%";
      orientationProps.width = "100%";
    }

    const imageTags = image?.tags?.map((tag) => {
      if (refreshOnSelect) {
        return (
          <Link passHref href={getTagUrl(tag)} key={`${image.name}-${tag}`}>
            <MetaLink
              key={`${image.name}-${tag}`}
              onClick={() => {
                setTimeout(() => {
                  Router.reload();
                }, 250);
              }}
            >
              {capitalizeAll(tag)}
            </MetaLink>
          </Link>
        );
      }
      return (
        <Link passHref href={getTagUrl(tag)} key={`${image.name}-${tag}`}>
          <MetaLink>{capitalizeAll(tag)}</MetaLink>
        </Link>
      );
    });

    let imageModel = (
      <Link
        passHref
        href={getModelUrl(image.model)}
        key={`${image.name}-${image.model}`}
      >
        <MetaLink>{image.model}</MetaLink>
      </Link>
    );
    if (refreshOnSelect) {
      imageModel = (
        <Link
          passHref
          href={getModelUrl(image.model)}
          key={`${image.name}-${image.model}`}
        >
          <MetaLink
            onClick={() => {
              setTimeout(() => {
                Router.reload();
              }, 250);
            }}
          >
            {image.model}
          </MetaLink>
        </Link>
      );
    }

    return (
      <>
        <ImageContainer orientation={image.orientation}>
          <LazyImage
            key={image.name}
            loadingSize="50%"
            {...bind()}
            style={{
              touchAction: "none",
            }}
            srcSet={imageUrl}
            src={getImageSource(image.name)}
            alt={image.alt}
            {...orientationProps}
          />
        </ImageContainer>
        <MetaList>
          <MetaItem>
            <DateIcon />
            <time>{toReadableDateString(image.date)}</time>
          </MetaItem>
          <MetaItem>
            <LocationIcon />
            {image.location?.address}
          </MetaItem>
          <MetaItem>
            <CameraIcon />
            {imageModel}
          </MetaItem>
          <MetaItem>
            <TagIcon />
            <MetaTags>{imageTags}</MetaTags>
          </MetaItem>
        </MetaList>
        <PrevNextOpts>
          {image.prev && (
            <Prev
              title="Previous Image"
              onClick={() => setSelectedImageName(image.prev)}
            >
              <LeftArrow />
            </Prev>
          )}
          {image.next && (
            <Next
              title="Next Image"
              onClick={() => setSelectedImageName(image.next)}
            >
              <RightArrow />
            </Next>
          )}
        </PrevNextOpts>
        <DownloadIconWrapper onClick={() => saveAs(getImageSource(image.name))}>
          Download Original
          <DownloadIcon />
        </DownloadIconWrapper>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, setSelectedImageName, bind, supportsWebp]);

  return (
    <ModalWrapper isOpen={image?.name}>
      <CloseModalBtn onClick={closeModal}>&times;</CloseModalBtn>
      <animated.div
        {...bind()}
        style={{
          x,
          touchAction: "none",
        }}
      >
        <ModalContainer>{ImageRender}</ModalContainer>
      </animated.div>
    </ModalWrapper>
  );
}

export default memo(LightboxModal);

const ModalWrapperProps = (props) =>
  props.isOpen &&
  `
  opacity: 1;
  visibility: visible;
`;
const ModalWrapper = styled.div`
  position: fixed;
  visibility: hidden;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  opacity: 0;
  transition: all 0.3s;
  ${ModalWrapperProps}
  max-height: 100vh;
`;

const ModalContainerBreakpoints = setEachBreakpoint({
  xs: `
  width: 100vw;
  `,
  sm: `
  width: 95vw;
  `,
  md: `
  width: 90vw;
  `,
  lg: `
  width: 75vw;
  `,
  xl: `
  width: 70vw;
  `,
  xxl: `
  width: 60vw;
  `,
});
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  ${ModalContainerBreakpoints}
`;

const CloseModalBtnBreakpoints = setEachBreakpoint({
  xs: `
  top: 2px;
  right: 15px;
  font-size: 4rem;
`,
  lg: `
  font-size: 7rem;
`,
  xl: `
  font-size: 12rem;
  right: 60px;
`,
  xxl: `
  font-size: 14rem;
  right: 80px;
`,
});
const CloseModalBtn = styled.button`
  user-select: none;
  z-index: 10;
  position: absolute;
  top: 15px;
  right: 30px;
  font-size: 6rem;
  border: none;
  padding: 0;
  text-decoration: none;
  color: var(--background);
  display: block;
  transition: 0.3s;
  background-color: rgba(0, 0, 0, 0);
  appearance: none;
  :hover {
    cursor: pointer;
    color: var(--background-accent);
    opacity: 0.7;
  }
  ${CloseModalBtnBreakpoints}
`;

const ImageContainerProps = (props) => {
  let imageStyle = "";
  if (props.orientation === "tall") {
    imageStyle = `
      ${BREAKPOINT_XS} {
        height: 50vh;
        max-height: 50vh;
      }
      ${BREAKPOINT_SM} {
        height: 50vh;
        max-height: 50vh;
      }
      ${BREAKPOINT_MD} {
        height: 50vh;
        max-height: 50vh;
      }
      width: auto;
      height: 60vh;
      max-height: 60vh;
    `;
  } else {
    imageStyle = `
      ${BREAKPOINT_XS} {
        width: 100vw;
        max-height: 80vh;
      }
      ${BREAKPOINT_SM} {
        width: 100vw;
      }
      ${BREAKPOINT_MD} {
        width: 100vw;
      }
      ${BREAKPOINT_LG} {
        width: 65vw;
      }
      ${BREAKPOINT_XL} {
        width: 50vw;
      }
      width: 40vw;
      height: auto;
    `;
  }
  return imageStyle;
};
const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${ImageContainerProps}
  img {
    touch-action: none;
  }
`;

const MetaListBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.2rem;
  color: var(--background);
  max-width: 70%;
  svg {
    min-width: 1.2rem;
    width: 1.2rem;
    height: 1.2rem;
  }
 `,
  sm: `
  font-size: 1.3rem;
  color: var(--background);
  max-width: 70%;
  svg {
    min-width: 1.3rem;
    width: 1.3rem;
    height: 1.3rem;
  }
`,
});
const MetaList = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: column;
  margin: 30px;
  font-size: 1.5rem;
  color: var(--background);
  max-width: 50%;
  svg {
    min-width: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    fill: var(--background);
    margin-right: 10px;
  }
  ${MetaListBreakpoints}
`;
const MetaItem = styled.div`
  z-index: 99;
  display: flex;
  align-content: center;
  margin-bottom: 1rem;
`;
const MetaTags = styled.div`
  display: flex;
  align-content: center;
  flex-wrap: wrap;
`;
const MetaLink = styled.a`
  z-index: 99;
  color: var(--background);
  text-decoration: underline;
  :hover {
    color: var(--primary);
  }

  margin-left: 0.5rem;
  :first-of-type {
    margin-left: 0;
  }
`;

const PrevNextOptsBreakpoints = setEachBreakpoint({
  sm: `
  bottom: 15%;
  svg {
    width: 6rem;
    height: 6rem;
    fill: var(--background);
  }
  `,
  md: `
  bottom: 15%;
  svg {
    width: 7rem;
    height: 7rem;
    fill: var(--background);
  }
  `,
  lg: `
  bottom: 45%;
  svg {
    width: 10rem;
    height: 10rem;
    fill: var(--background);
  }
  `,
  xl: `
  bottom: 45%;
  svg {
    width: 12rem;
    height: 12rem;
    fill: var(--background);
    fill: var(--background);
  }
`,
  xxl: `
  bottom: 45%;
  svg {
    width: 14rem;
    height: 14rem;
    fill: var(--background);
  }
  `,
});
const PrevNextOpts = styled.div`
  z-index: 1;
  position: absolute;
  bottom: 15%;
  display: flex;
  width: 100%;
  svg {
    width: 4rem;
    height: 4rem;
    fill: var(--background);
  }
  ${PrevNextOptsBreakpoints}
`;

const Prev = styled.a`
  display: inline-flex;
  align-items: center;
  text-align: left;
  :hover {
    svg {
      fill: var(--primary);
    }
  }
`;
const Next = styled(Prev)`
  text-align: right;
  margin-left: auto;
`;

const DownloadIconWrapperBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.2rem;
  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`,
});
const DownloadIconWrapper = styled.div`
  text-decoration: underline;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 5;
  user-select: none;

  font-size: 1.5rem;
  color: var(--background);
  margin-bottom: 30px;

  :hover {
    cursor: pointer;
    color: var(--primary);
    svg {
      fill: var(--primary);
    }
  }

  svg {
    margin-left: 15px;
    width: 3rem;
    height: 3rem;
    fill: var(--background);
  }
  ${DownloadIconWrapperBreakpoints}
`;