import { saveAs } from "file-saver";
import fuzzysort from "fuzzysort";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";

import Copyright from "../../shared/components/copyright";
import Header from "../../shared/components/header";
import Modal from "../../shared/components/image-modal";
import Tooltip from "../../shared/components/tooltip";
import { ASCENDING, DESCENDING } from "../../shared/constants/sort";
import DateIcon from "../../shared/svgs/date-icon";
import TagIcon from "../../shared/svgs/tag-icon";
import AppContext from "../../shared/utils/app-context";
import { setEachBreakpoint } from "../../shared/utils/breakpoints";
import { toReadableDateString } from "../../shared/utils/dates";
import { getImageSetSrc, getImageSource } from "../../shared/utils/image";
import { capitalizeAll } from "../../shared/utils/strings";
import Meta from "../src/components/meta";
import CameraIcon from "../src/svgs/camera-icon";
import DownloadIcon from "../src/svgs/download-icon";
import LocationIcon from "../src/svgs/location-icon";
import ZoomInIcon from "../src/svgs/zoom-icon";
import { fetchPhotos } from "../src/utils/fetch-photos";

const ALL_TAG = "all";
const ITEMS_PER_PAGE = 5;
const PAGINATE_OFFSET = 200;

const sortByOpts = [
  { key: "date", direction: DESCENDING, label: "Newest First" },
  { key: "downloads", direction: DESCENDING, label: "Most Downloaded" },
  { key: "date", direction: ASCENDING, label: "Oldest First" },
  { key: "downloads", direction: ASCENDING, label: "Least Downloaded" },
];

export default function Home({ images, tags, models }) {
  const router = useRouter();
  const entriesRef = useRef(null);
  const headerRef = useRef(null);
  // Load tag from URL #/{tag} path or default to ALL
  const [selectedTag, rawSetSelectedTag] = useState(
    router.asPath !== "/" ? router.asPath.replace("/#", "") : ALL_TAG
  );
  const [selectedModel, setSelectedModel] = useState(ALL_TAG);
  const setSelectedTag = useCallback(
    (tag) => {
      if (tag !== ALL_TAG) {
        router.push(`#${tag}`, undefined, { shallow: true });
      } else {
        router.push(`/`, undefined, { shallow: true });
      }
      rawSetSelectedTag(tag);
    },
    [router]
  );

  const [modalContents, setModalContents] = useState(undefined);
  const appState = {
    modalContents,
    setModalContents,
  };
  const onZoomModal = useCallback(
    (imageUrl, imageAlt) => {
      setModalContents(
        <img
          srcSet={imageUrl}
          alt={imageAlt}
          width="100%"
          height="100%"
          onClick={() => {
            setModalContents();
          }}
        />
      );
    },
    [setModalContents]
  );

  const [paginationCount, setPaginationCount] = useState(ITEMS_PER_PAGE + 5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(sortByOpts[0]);

  const maxPages = useMemo(() => images.length + ITEMS_PER_PAGE, [images]);
  let filteredImages = Object.values(images);

  // Pagination scroll detect
  const onScroll = useCallback(
    (e) => {
      if (paginationCount > maxPages) {
        return;
      }
      const node = e.target;
      if (entriesRef.current && headerRef.current) {
        const totalHeight =
          entriesRef.current.scrollHeight + headerRef.current.scrollHeight;
        const currentScroll = node.scrollTop + node.clientHeight;
        if (totalHeight - PAGINATE_OFFSET <= currentScroll) {
          setPaginationCount((prev) => prev + ITEMS_PER_PAGE);
        }
      }
    },
    [paginationCount, maxPages]
  );

  filteredImages = useMemo(() => {
    if (!searchQuery) {
      return filteredImages;
    }
    return fuzzysort
      .go(searchQuery, images, {
        keys: ["name", "alt", "model"],
        scoreFn: (keysResult) => {
          const nameRes = keysResult[0];
          const altRes = keysResult[1];
          const modelRes = keysResult[2];
          let score = Math.max(
            nameRes ? nameRes.score : -Infinity,
            altRes ? altRes.score : -Infinity,
            modelRes ? modelRes.score : -Infinity
          );
          // When all three keys, prioritize over just one two
          if (nameRes?.score && altRes?.score && modelRes?.score) {
            score = score + 1500;
          } else if (
            (nameRes?.score && altRes?.score) ||
            (nameRes?.score && modelRes?.score)
          ) {
            // When title and one other key, prioritize next
            score = score + 1000;
          } else if (nameRes?.score) {
            // When just title, prioritize title over other combos or singles
            score = score + 500;
          }
          return score;
        },
      })
      .map((e) => e.obj);
  }, [filteredImages, searchQuery, images]);

  // Sort entries
  filteredImages = useMemo(
    () =>
      [...filteredImages].sort((a, b) => {
        const isAscending = sortBy.direction === ASCENDING ? 1 : -1;
        let aCompare = a[sortBy.key];
        let bCompare = b[sortBy.key];
        if (sortBy.key === "date") {
          aCompare = new Date(aCompare);
          bCompare = new Date(bCompare);
        }
        if (aCompare > bCompare) {
          return isAscending;
        }
        return -isAscending;
      }),
    [filteredImages, sortBy]
  );

  // Filter entries by tag
  filteredImages = useMemo(
    () =>
      filteredImages.filter((image) => {
        // Only map entries in selected tag
        if (selectedTag !== ALL_TAG && !image.tags.includes(selectedTag)) {
          return false;
        }
        return true;
      }),
    [filteredImages, selectedTag]
  );

  // Filter entries by model
  filteredImages = useMemo(
    () =>
      filteredImages.filter((image) => {
        // Only map entries in selected model
        if (selectedModel !== ALL_TAG) {
          if (!image?.model) {
            return false;
          } else if (
            image.model.toLowerCase() !== selectedModel.toLowerCase()
          ) {
            return false;
          }
        }
        return true;
      }),
    [filteredImages, selectedModel]
  );

  // Paginate entries
  filteredImages = useMemo(
    () => filteredImages.slice(0, paginationCount),
    [filteredImages, paginationCount]
  );

  const EntriesRender = useMemo(() => {
    if (!filteredImages.length) {
      return (
        <ImageContainer key={`lazy-no-images-found`} big>
          <LazyLoadImage
            src={process.env.NOT_FOUND_IMAGE_URL}
            alt="Hide the pain Harold"
            width="100%"
            height="100%"
          />
          <ImageMeta>
            <MetaList>
              <div>No Images Found</div>
              <br />
              <LazyLoadImage
                src={process.env.NOT_FOUND_HOVER_IMAGE_URL}
                alt="Smiley cry emoji with single tear"
                width="100%"
                height="100%"
              />
            </MetaList>
          </ImageMeta>
        </ImageContainer>
      );
    }
    return filteredImages.map((image) => {
      const imageProps = {};
      if (image.orientation) {
        imageProps[image.orientation] = true;
      }
      const imageUrl = getImageSetSrc(image.name);
      return (
        <ImageContainer key={`lazy-${image.name}`} {...imageProps}>
          <LazyLoadImage
            srcSet={imageUrl}
            alt={image.alt}
            width="100%"
            height="100%"
          />
          <ImageMeta>
            <MetaList>
              <MetaItem>
                <DateIcon />
                {toReadableDateString(image.date)}
              </MetaItem>
              <MetaItem>
                <LocationIcon />
                {image.location?.address}
              </MetaItem>
              <MetaItem>
                <CameraIcon />
                {image.model}
              </MetaItem>
              <MetaItem>
                <TagIcon />
                <MetaTags>
                  {image.tags.map((tag) => (
                    <MetaTag
                      onClick={() => setSelectedTag(tag.toLowerCase())}
                      key={`${image.name}-${tag}`}
                    >
                      {capitalizeAll(tag)}
                    </MetaTag>
                  ))}
                </MetaTags>
              </MetaItem>
            </MetaList>
            <ZoomIconWrapper>
              <Tooltip
                text="Zoom Photo"
                isIcon
                linkOnClick={() => onZoomModal(imageUrl, image.alt)}
              >
                <ZoomInIcon />
              </Tooltip>
            </ZoomIconWrapper>
            <DownloadIconWrapper>
              <Tooltip
                text="Download Original"
                isIcon
                linkOnClick={() => {
                  saveAs(getImageSource(image.name));
                }}
              >
                <DownloadIcon />
              </Tooltip>
            </DownloadIconWrapper>
          </ImageMeta>
        </ImageContainer>
      );
    });
  }, [filteredImages, setSelectedTag, onZoomModal]);

  return (
    <>
      <Meta
        title="Photography - Evan Bonsignori"
        description="Free to use photos taken by Evan Bonsignori"
        keywords="Photography, Free Images, Evan Bonsignori"
        image="https://evan-bio-assets.s3.amazonaws.com/blog-themed-pencil-icon.jpg"
        imageAlt="Pencil icon with colors matching the theme of the blog"
        type="blog"
      />
      <AppContext.Provider value={appState}>
        <Modal modalContents={modalContents} />
        <PageWrapper onScroll={onScroll}>
          <Header
            headerRef={headerRef}
            title="Photos"
            subtitle="by Evan Bonsignori"
            navLinks={[
              { url: "/license", name: "License" },
              { url: "/photo-map", name: "Photo Map" },
              { url: process.env.WRITING_PAGE_URL, name: "Blog" },
              { url: process.env.ABOUT_PAGE_URL, name: "About Me" },
            ]}
            tags={[
              {
                pluralName: "tags",
                icon: <TagIcon />,
                multiple: false,
                options: tags,
                selected: selectedTag,
                setSelected: setSelectedTag,
                includeAll: true,
              },
              {
                pluralName: "models",
                icon: <CameraIcon />,
                multiple: false,
                options: models,
                selected: selectedModel,
                setSelected: setSelectedModel,
                includeAll: true,
              },
            ]}
            search={{
              searchQuery,
              setSearchQuery,
            }}
            sortBy={{
              sortBy,
              setSortBy,
              options: sortByOpts,
            }}
          />
          <ImagesWrapper>
            <Images ref={entriesRef}>{EntriesRender}</Images>
          </ImagesWrapper>
          <Copyright />
        </PageWrapper>
      </AppContext.Provider>
    </>
  );
}

export async function getStaticProps() {
  const catalogueData = fetchPhotos();
  return {
    props: { ...catalogueData },
  };
}

const PageWrapper = styled.div`
  position: relative;
  max-height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100vw;
  max-width: 100vw;
`;

const ImagesWrapper = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  display: flex;
  justify-content: center;
  width: 100%;
`;

const ImagesBreakpoints = setEachBreakpoint({
  xs: `
  grid-template-columns: 100%;
  grid-auto-rows: 1fr;
  grid-gap: 5px;
  `,
  lg: `
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  grid-auto-rows: 1fr;
  margin: 0 200px;
  `,
  xl: `
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  grid-auto-rows: 1fr;
  margin: 0 200px;
  `,
  xxl: `
  grid-template-columns: repeat(5, minmax(250px, 1fr));
  grid-auto-rows: 1fr;
  margin: 0 300px;
  `,
});

const Images = styled.div`
  display: grid;
  margin: 0 5px;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense;
  ${ImagesBreakpoints}
`;

const ImageContainerBreakpoints = setEachBreakpoint({
  xs: `
    grid-column: span 1;
    grid-row: span 1;
  `,
});
const ImageContainerProps = (props) => {
  let styles = "";
  if (props.big) {
    styles = `
      grid-column: span 2;
      grid-row: span 2;
    `;
  } else if (props.tall) {
    styles = `
      grid-row: span 2;
    `;
  } else if (props.wide) {
    styles = `
      grid-column: span 2;
    `;
  }
  return styles;
};
const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${ImageContainerProps}
  ${ImageContainerBreakpoints}

  img {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
    display: inline-block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  div {
    transition: opacity 0.3s;
  }

  :hover,
  :focus,
  :target {
    div {
      opacity: 1;
    }
  }
`;

const ImageMeta = styled.div`
  position: absolute;
  opacity: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  color: var(--background);
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 2;
  border-radius: 5px;
`;

const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px;
  font-size: 1.5rem;
  svg {
    width: 1.5rem;
    fill: var(--background);
    margin-right: 10px;
  }
`;
const MetaItem = styled.div`
  display: flex;
  align-content: center;
  margin-bottom: 1rem;
`;
const MetaTags = styled.div`
  display: flex;
  align-content: center;
`;
const MetaTag = styled.a`
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

const IconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 5;
  padding: 30px;
  svg {
    width: 3rem;
    fill: var(--background);
    :hover {
      cursor: pointer;
      fill: var(--primary);
    }
  }
`;

const ZoomIconWrapper = styled(IconWrapper)`
  left: 0;
`;

const DownloadIconWrapper = styled(IconWrapper)`
  right: 0;
`;
