/* eslint-disable max-len */
import { useRouter } from "next/router";
import randomColor from "randomcolor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, MeshLambertMaterial } from "three";
import { feature } from "topojson-client";

import Header from "../../shared/components/header";
import { toReadableDateString } from "../../shared/utils/dates";
import LightboxModal from "../src/components/lightbox-modal";
import Meta from "../src/components/meta";
import { fetchPhotos } from "../src/utils/fetch-photos";

function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

const pointsAltitude = {};
const ALTITUDE = (image) => {
  if (!pointsAltitude[image.name]) {
    const randomAltitude = generateRandomNumber(0.15, 0.4);
    pointsAltitude[image.name] = randomAltitude;
    return randomAltitude;
  }
  return pointsAltitude[image.name];
};
const pointsColors = {};
const COLOR = (image) => {
  if (!pointsColors[image.name]) {
    const color = randomColor({
      format: "rgba",
      alpha: 0.75,
    });

    pointsColors[image.name] = color;
    return color;
  }
  return pointsColors[image.name];
};

const LABEL_RADIUS = () => 0.85;
const POINT_RADIUS = () => 0.1;
const RESOLUTION = 2;

export default function GlobeComponent({ images }) {
  const globeRef = useRef();
  const router = useRouter();
  const queryHash = useMemo(() => {
    return router.asPath.match(/#([a-z0-9]+)/gi) || "";
  }, [router]);
  const [globe, setGlobe] = useState(null);
  const [imagesWithOrder, setImagesWithOrder] = useState([]);

  const [selectedImageName, rawSetSelectedImageName] = useState(
    queryHash ? images[queryHash] : undefined
  );
  const setSelectedImageName = useCallback(
    (imageName) => {
      imageName = imageName.toLowerCase();
      if (imageName) {
        router.push(`#${imageName}`, undefined, {
          shallow: true,
        });
      } else {
        router.push(`/photo-map`, undefined, {
          shallow: true,
        });
      }
      rawSetSelectedImageName(imageName);
    },
    [router]
  );

  // TODO: Render better-styled React HTML here
  const getTooltip = useMemo(
    () => (image) =>
      `
      <div style="text-align: center; color: white; background-color: rgba(0, 0, 0, 0.75); padding: 10px; border-radius: 10px;">
        <div>${image?.location?.address ? image.location.address : ""}, <b>${
        image.name
      }</b></div>
        <div><em>${toReadableDateString(image.date)}</em></div>
      </div>
    `,
    []
  );

  useEffect(() => {
    if (!Object.values(imagesWithOrder).length) {
      const sortedImages = { ...images };
      const imagesArr = Object.values(images);
      for (let i = 0; i < imagesArr.length; i++) {
        const currentImageName = imagesArr[i].name;
        if (i - 1 >= 0) {
          sortedImages[currentImageName].prev = imagesArr[i - 1].name;
        } else {
          sortedImages[currentImageName].prev =
            imagesArr[imagesArr.length - 1].name;
        }
        if (i + 1 < imagesArr.length) {
          sortedImages[currentImageName].next = imagesArr[i + 1].name;
        } else {
          sortedImages[currentImageName].next = imagesArr[0].name;
        }
      }
      setImagesWithOrder(sortedImages);
    }

    async function getGlobe() {
      const ThreeGlobe = (await import("react-globe.gl")).default;
      const polygonsMaterial = new MeshLambertMaterial({
        color: "darkslategrey",
        side: DoubleSide,
      });
      const polygonsRes = await fetch("//unpkg.com/world-atlas/land-110m.json");
      const landTopo = await polygonsRes.json();
      const landPolygons = feature(landTopo, landTopo.objects.land).features;

      setGlobe(
        <ThreeGlobe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          showGlobe={false}
          showAtmosphere={false}
          polygonsData={landPolygons}
          polygonCapMaterial={polygonsMaterial}
          polygonSideColor={() => "rgba(0, 0, 0, 0)"}
          pointsData={Object.values(imagesWithOrder)}
          pointLat={(d) => (d.location ? d.location.latitude : null)}
          pointLng={(d) => (d.location ? d.location.longitude : null)}
          pointAltitude={ALTITUDE}
          pointRadius={POINT_RADIUS}
          pointColor={COLOR}
          pointResolution={RESOLUTION}
          pointLabel={getTooltip}
          onPointClick={(image) => {
            setSelectedImageName(image.name);
          }}
          labelsData={Object.values(imagesWithOrder)}
          labelLat={(d) => (d.location ? d.location.latitude : null)}
          labelLng={(d) => (d.location ? d.location.longitude : null)}
          labelText={() => ""}
          labelAltitude={ALTITUDE}
          labelLabel={getTooltip}
          labelSize={() => 0}
          labelDotRadius={LABEL_RADIUS}
          labelColor={COLOR}
          labelResolution={RESOLUTION}
          onLabelClick={(image) => {
            setSelectedImageName(image.name);
          }}
        />
      );
    }
    if (!globe) {
      getGlobe();
    }
  }, [
    globe,
    globeRef,
    imagesWithOrder,
    images,
    getTooltip,
    setSelectedImageName,
  ]);

  useMemo(() => {
    if (globeRef && globeRef.current && globeRef.current.pointOfView) {
      globeRef.current.pointOfView({
        lat: "39.01",
        lng: "-100.88",
        altitude: 1.5,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globe, globeRef]);

  return (
    <>
      <Meta
        title="Photo Map"
        description="Globe showing locations of all photos on the site"
        keywords="Photo Map, Locations, Image Globe"
        // TODO: Change this to globe image
        image="https://evan-bio-assets.s3.amazonaws.com/blog-themed-pencil-icon.jpg"
        imageAlt="Pencil icon with colors matching the theme of the blog"
      />
      <LightboxModal
        images={imagesWithOrder}
        imageName={selectedImageName}
        setSelectedImageName={setSelectedImageName}
      />
      <Header
        title="Photos"
        titleUrl={"/"}
        subtitle="by Evan Bonsignori"
        navLinks={[
          { url: "/license", name: "License" },
          { url: "/photo-map", name: "Photo Map", active: true },
          { url: process.env.WRITING_PAGE_URL, name: "Blog" },
          { url: process.env.ABOUT_PAGE_URL, name: "About Me" },
        ]}
      />
      {globe}
    </>
  );
}

export async function getStaticProps() {
  const catalogueData = fetchPhotos();
  return {
    props: { ...catalogueData },
  };
}
