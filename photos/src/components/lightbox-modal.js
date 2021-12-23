import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { saveAs } from "file-saver";
import Link from "next/link";
import Router from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

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
import LazyImage from "./lazy-image";

// eslint-disable-next-line func-style
const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyPressed;
};

function LightboxModal({ images, slug, setSelectedSlug, refreshOnSelect }) {
  useEffect(() => {
    if (window?.gtag && slug) {
      window?.gtag("event", "lightbox_viewed", {
        // eslint-disable-next-line camelcase
        page_path: slug,
      });
    }
  }, [slug]);

  // eslint-disable-next-line no-empty-pattern
  const [{}, api] = useSpring(() => ({ x: 0 }));
  let image = {};
  if (slug) {
    image = images[slug];
  }

  const closeModal = useCallback(() => {
    setSelectedSlug("");
  }, [setSelectedSlug]);

  // Navigate using keys
  const rightPres = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");
  const escapePress = useKeyPress("Escape");
  useEffect(() => {
    if (slug && image?.next && rightPres) {
      setSelectedSlug(image.next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightPres]);
  useEffect(() => {
    if (slug && image?.prev && leftPress) {
      setSelectedSlug(image.prev);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPress]);
  useEffect(() => {
    if (slug && escapePress) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escapePress]);

  const bind = useDrag(
    ({ down, movement: [mx], active }) => {
      if (!active && mx > 0) {
        setSelectedSlug(image.prev);
        mx = 0;
      } else if (!active) {
        setSelectedSlug(image.next);
        mx = 0;
      }
      api.start({
        x: down ? mx : 0,
      });
    },
    { bounds: { left: -100, right: 100 }, delay: 2000, threshold: 200 }
  );

  const ImageRender = useMemo(() => {
    if (!image || !image.slug) {
      return null;
    }
    const imageUrl = getImageSetSrc(image.slug);
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
          <Link passHref href={getTagUrl(tag)} key={`${image.slug}-${tag}`}>
            <MetaLink
              key={`${image.slug}-${tag}`}
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
        <Link passHref href={getTagUrl(tag)} key={`${image.slug}-${tag}`}>
          <MetaLink>{capitalizeAll(tag)}</MetaLink>
        </Link>
      );
    });

    let imageModel = (
      <Link
        passHref
        href={getModelUrl(image.model)}
        key={`${image.slug}-${image.model}`}
      >
        <MetaLink>{image.model}</MetaLink>
      </Link>
    );
    if (refreshOnSelect) {
      imageModel = (
        <Link
          passHref
          href={getModelUrl(image.model)}
          key={`${image.slug}-${image.model}`}
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
            key={image.slug}
            loadingSize="50%"
            {...bind()}
            style={{
              touchAction: "none",
            }}
            srcSet={imageUrl}
            src={getImageSource(image.slug)}
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
              onClick={() => setSelectedSlug(image.prev)}
            >
              <LeftArrow />
            </Prev>
          )}
          {image.next && (
            <Next
              title="Next Image"
              onClick={() => setSelectedSlug(image.next)}
            >
              <RightArrow />
            </Next>
          )}
        </PrevNextOpts>
        <DownloadIconWrapper
          onClick={() => {
            if (window?.gtag) {
              window?.gtag("event", "download", {
                // eslint-disable-next-line camelcase
                page_path: slug,
              });
            }
            saveAs(getImageSource(image.slug));
          }}
        >
          Download Original
          <DownloadIcon />
        </DownloadIconWrapper>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, setSelectedSlug, bind]);

  return (
    <ModalWrapper isOpen={image?.slug}>
      <CloseModalBtn onClick={closeModal}>&times;</CloseModalBtn>
      <animated.div
        {...bind()}
        style={{
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
  user-select: none;
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
