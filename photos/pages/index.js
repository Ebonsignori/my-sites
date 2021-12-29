import fuzzysort from "fuzzysort";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import Copyright from "../../shared/components/copyright";
import Header from "../../shared/components/header";
import { ASCENDING, DESCENDING } from "../../shared/constants/sort";
import TagIcon from "../../shared/svgs/tag-icon";
import {
  BREAKPOINT_XS,
  setEachBreakpoint,
} from "../../shared/utils/breakpoints";
import { getImageSetSrc, getImageSource } from "../../shared/utils/image";
import { capitalizeAll } from "../../shared/utils/strings";
import LazyImage from "../src/components/lazy-image";
import LightboxModal from "../src/components/lightbox-modal";
import Meta from "../src/components/meta";
import CameraIcon from "../src/svgs/camera-icon";
import { fetchPhotos } from "../src/utils/fetch-photos";

const ALL_TAG = "all";
const ITEMS_PER_PAGE = 8;
const PAGINATE_OFFSET = 200;

const sortByOpts = [
  { key: "date", direction: DESCENDING, label: "Newest First" },
  { key: "downloads", direction: DESCENDING, label: "Most Downloaded" },
  { key: "date", direction: ASCENDING, label: "Oldest First" },
  { key: "downloads", direction: ASCENDING, label: "Least Downloaded" },
];

export default function Home({ images, tags, models }) {
  const router = useRouter();
  const queryHash = useMemo(() => {
    return router.asPath.match(/#([a-z0-9-]+)/gi) || "";
  }, [router]);
  const queryParams = useMemo(() => {
    return router.asPath.match(/(\?|&)([a-z0-9]+)/gi) || [];
  }, [router]);
  const imagesRef = useRef(null);
  const headerRef = useRef(null);
  // Load tag from URL #/{tag} path or default to ALL
  const [selectedTag, rawSetSelectedTag] = useState(
    queryParams?.tags ? router.query.tags : ALL_TAG
  );
  useEffect(() => {
    const queryTag = router.query?.tags;
    if (queryTag && selectedTag !== queryTag) {
      rawSetSelectedTag(queryTag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query?.tags]);
  const setSelectedTag = useCallback(
    (tag) => {
      tag = tag?.toLowerCase();
      let modelsQuery = "";
      if (queryParams?.includes("?models") || queryParams.includes("&models")) {
        modelsQuery = `&models=${router.query.models}`;
      }
      if (tag !== ALL_TAG) {
        router.push(`?tags=${tag}${modelsQuery}`, undefined, { shallow: true });
      } else {
        router.push(`/${modelsQuery.replace("&", "?")}`, undefined, {
          shallow: true,
        });
      }
      rawSetSelectedTag(tag);
    },
    [queryParams, router]
  );
  const [selectedModel, rawSetSelectedModel] = useState(
    queryParams?.models ? router.query.models : ALL_TAG
  );
  useEffect(() => {
    const queryModel = router.query?.models;
    if (queryModel && selectedModel !== queryModel) {
      rawSetSelectedModel(queryModel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query?.models]);
  const setSelectedModel = useCallback(
    (model) => {
      model = model?.toLowerCase();
      let tagsQuery = "";
      if (queryParams?.includes("?tags") || queryParams?.includes("&tags")) {
        tagsQuery = `&tags=${router.query.tags}`;
      }
      if (model !== ALL_TAG) {
        router.push(`?models=${model}${tagsQuery}`, undefined, {
          shallow: true,
        });
      } else {
        router.push(`/${tagsQuery.replace("&", "?")}`, undefined, {
          shallow: true,
        });
      }
      rawSetSelectedModel(model);
    },
    [queryParams, router]
  );

  const [selectedSlug, rawSetSelectedSlug] = useState(
    queryHash?.length ? queryHash[0].replace("#", "") : undefined
  );
  const setSelectedSlug = useCallback(
    (slug) => {
      slug = slug?.toLowerCase();
      let existingQuery = "";
      if (queryParams?.includes("?tags") || queryParams?.includes("&tags")) {
        existingQuery += `?tags=${router.query.tags}`;
      }
      if (
        queryParams?.includes("?models") ||
        queryParams?.includes("&models")
      ) {
        if (existingQuery !== "") {
          existingQuery += "&";
        } else {
          existingQuery += "?";
        }
        existingQuery += `models=${router.query.models}`;
      }
      if (slug) {
        router.push(`/#${slug}${existingQuery}`, undefined, {
          shallow: true,
        });
      } else {
        router.push(`/${existingQuery}`, undefined, {
          shallow: true,
        });
      }
      rawSetSelectedSlug(slug);
    },
    [queryParams, router]
  );

  // Filtering
  const [paginationCount, setPaginationCount] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(sortByOpts[0]);

  let filteredImages = Object.values(images);
  const maxPages = useMemo(
    () => filteredImages.length + ITEMS_PER_PAGE,
    [filteredImages]
  );

  const onScroll = useCallback(
    (e) => {
      // Paginate images
      if (paginationCount > maxPages) {
        return;
      }
      const node = e.target;
      if (imagesRef.current && headerRef.current) {
        const totalHeight =
          imagesRef.current.scrollHeight + headerRef.current.scrollHeight;
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
        keys: ["slug", "alt", "model"],
        scoreFn: (keysResult) => {
          const slugRes = keysResult[0];
          const altRes = keysResult[1];
          const modelRes = keysResult[2];
          let score = Math.max(
            slugRes ? slugRes.score : -Infinity,
            altRes ? altRes.score : -Infinity,
            modelRes ? modelRes.score : -Infinity
          );
          // When all three keys, prioritize over just one two
          if (slugRes?.score && altRes?.score && modelRes?.score) {
            score = score + 1500;
          } else if (
            (slugRes?.score && altRes?.score) ||
            (slugRes?.score && modelRes?.score)
          ) {
            // When title and one other key, prioritize next
            score = score + 1000;
          } else if (slugRes?.score) {
            // When just title, prioritize title over other combos or singles
            score = score + 500;
          }
          return score;
        },
      })
      .map((e) => e.obj);
  }, [filteredImages, searchQuery, images]);

  // Sort Images
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

  // Filter images by tag
  filteredImages = useMemo(
    () =>
      filteredImages.filter((image) => {
        // Only map images in selected tag
        if (selectedTag !== ALL_TAG && !image.tags.includes(selectedTag)) {
          return false;
        }
        return true;
      }),
    [filteredImages, selectedTag]
  );

  // Filter images by model
  filteredImages = useMemo(
    () =>
      filteredImages.filter((image) => {
        // Only map images in selected model
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

  // Set order of images on prop object for modal nav
  const [imagesWithOrder, setImagesWithOrder] = useState({});
  useEffect(() => {
    for (let i = 0; i < filteredImages.length; i++) {
      const currentImageSlug = filteredImages[i].slug;
      if (i - 1 >= 0) {
        images[currentImageSlug].prev = filteredImages[i - 1].slug;
      } else {
        images[currentImageSlug].prev =
          filteredImages[filteredImages.length - 1].slug;
      }
      if (i + 1 < filteredImages.length) {
        images[currentImageSlug].next = filteredImages[i + 1].slug;
      } else {
        images[currentImageSlug].next = filteredImages[0].slug;
      }
    }
    setImagesWithOrder(images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredImages]);

  // Paginate images
  filteredImages = useMemo(
    () => filteredImages.slice(0, paginationCount),
    [filteredImages, paginationCount]
  );

  let ImagesRender = null;
  if (!filteredImages.length) {
    ImagesRender = (
      <ImageContainer key={`lazy-no-images-found`} big>
        <img
          src={process.env.NOT_FOUND_IMAGE_URL}
          alt="Hide the pain Harold"
          width="100%"
          height="100%"
        />
        <ImageMeta>
          <MetaList>
            <div>No Images Found</div>
            <br />
            <img
              src={process.env.NOT_FOUND_HOVER_IMAGE_URL}
              alt="Smiley cry emoji with single tear"
              width="100%"
              height="100%"
            />
          </MetaList>
        </ImageMeta>
      </ImageContainer>
    );
  } else {
    ImagesRender = filteredImages.map((image) => {
      const imageProps = {};
      if (image.orientation) {
        imageProps[image.orientation] = true;
      }
      const imageUrl = getImageSetSrc(image.slug);
      return (
        <ImageContainer
          key={`lazy-${image.slug}`}
          {...imageProps}
          onClick={() => {
            if (window?.gtag) {
              window?.gtag("event", "homepage_click", {
                // eslint-disable-next-line camelcase
                page_path: image.slug,
              });
            }
            setSelectedSlug(image.slug);
          }}
        >
          <ImageWrapper>
            <LazyImage
              key={image.slug}
              srcSet={imageUrl}
              src={getImageSource(image.slug)}
              {...imageProps}
              alt={image.alt}
              width="100%"
              height="100%"
            />
            <ImageMeta>
              <MetaList>
                <MetaItem>
                  <CameraIcon />
                  <MetaLink onClick={() => setSelectedModel(image.model)}>
                    {image.model}
                  </MetaLink>
                </MetaItem>
                <MetaItem>
                  <TagIcon />
                  <MetaTags>
                    {image.tags.map((tag) => (
                      <MetaLink
                        onClick={() => setSelectedTag(tag)}
                        key={`${image.slug}-${tag}`}
                      >
                        {capitalizeAll(tag)}
                      </MetaLink>
                    ))}
                  </MetaTags>
                </MetaItem>
              </MetaList>
            </ImageMeta>
          </ImageWrapper>
        </ImageContainer>
      );
    });
  }

  const Modal = useMemo(() => {
    return (
      <LightboxModal
        images={imagesWithOrder}
        slug={selectedSlug}
        setSelectedSlug={setSelectedSlug}
        refreshOnSelect
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, imagesWithOrder]);

  return (
    <>
      <Meta
        title="Photography - Evan Bonsignori"
        description="Free to use photos taken by Evan Bonsignori"
        keywords="Photography, Free Images, Evan Bonsignori"
        image={`${process.env.BASE_ASSET_URL}/photos-themed-camera-icon.png`}
        imageAlt="Camera icon with colors matching the theme of the photos site"
        type="website"
      />
      {Modal}
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
        <ImagesWrapper ref={imagesRef}>
          <Images>{ImagesRender}</Images>
        </ImagesWrapper>
        <Copyright />
      </PageWrapper>
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
  }

  display: flex;
  justify-content: center;
  min-width: 100vw;
  min-height: 100vh;
`;

const ImagesBreakpoints = setEachBreakpoint({
  xs: `
  grid-template-columns: 100%;
  grid-auto-rows: 60vw;
  grid-gap: 5px;
  `,
  sm: `
  grid-template-columns: 100%;
  grid-auto-rows: .5fr;
  grid-gap: 5px;
  `,
  md: `
  grid-template-columns: repeat(2, minmax(225px, 1fr));
  grid-auto-rows: .5fr;
  `,
  lg: `
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  grid-auto-rows: .5fr;
  `,
  xl: `
  grid-template-columns: repeat(3, minmax(355px, 1fr));
  grid-auto-rows: .5fr;
  `,
  xxl: `
  grid-template-columns: repeat(4, minmax(400px, 1fr));
  grid-auto-rows: .5fr;
  `,
});

const Images = styled.div`
  width: 100%;
  display: grid;
  margin: 0 5px;
  grid-gap: 10px;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  grid-auto-rows: 250px;
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
      grid-row: span 3;
      ${BREAKPOINT_XS} {
        grid-row: span 3;
      }
    `;
  } else if (props.wide) {
    styles = `
      grid-column: span 2;
      &:last-child:nth-child(3n - 2) {
        grid-column: span 3;
      }
    `;
  }
  return styles;
};

const ImageMeta = styled.div`
  position: absolute;
  top: 0;
  opacity: 0;
  transition: opacity 0.5s;
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: flex-start;
  align-items: flex-start;
  color: var(--background);
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 2;
  border-radius: 5px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid black;
  &:last-child:nth-child(3n - 2) {
    grid-column: span 3 !important;
  }
  ${ImageContainerBreakpoints}
  ${ImageContainerProps}

  svg {
    user-select: none;
  }

  * {
    transition: opacity 0.5s;
  }

  :hover,
  :focus,
  :target {
    cursor: pointer;
    * {
      opacity: 1;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  user-select: none;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

const ImageMetaListBreakpoints = setEachBreakpoint({
  lg: `
  font-size: 1.5rem;
  margin: 0.75rem;
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  `,
  xl: `
  font-size: 1.75rem;
  margin: 1rem;
  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  `,
  xxl: `
  font-size: 2rem;
  margin: 1rem;
  svg {
    width: 2rem;
    height: 2rem;
  }
  `,
});
const MetaList = styled.div`
  opacity: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 0.5rem;
  font-size: 1rem;
  svg {
    width: 1rem;
    height: 1rem;
    fill: var(--background);
    margin-right: 10px;
  }
  ${ImageMetaListBreakpoints}
`;
const MetaItem = styled.div`
  display: flex;
  align-content: center;
  margin: 0.5rem;
`;
const MetaTags = styled.div`
  display: flex;
  align-content: center;
`;
const MetaLink = styled.a`
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
