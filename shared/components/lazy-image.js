import { memo, useEffect, useMemo, useState } from "react";
import { SpinnerDotted } from "spinners-react/lib/esm/SpinnerDotted";

// eslint-disable-next-line max-len
const image = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=`;

// More like a Loading image, not actually lazy-loaded
function LazyImage(props) {
  const [loaded, setLoaded] = useState(false);
  const [postLoadingDone, setPostLoadingDone] = useState(false);

  const [placeHolderProps, imageProps] = useMemo(() => {
    const _placeHolderProps = {
      src: image,
      srcSet: image,
      height: props.tall ? "100%" : props.height,
      width: props.tall ? "auto" : props.width,
      alt: "Transparent placeholder image",
    };
    if (props.loadingSize) {
      _placeHolderProps.height = props.loadingSize;
      _placeHolderProps.width = props.loadingSize;
    }
    const _imageProps = {
      src: props.src,
      srcSet: props.srcSet,
      height: props.height,
      width: props.width,
      alt: props.alt,
    };
    return [_placeHolderProps, _imageProps];
  }, [props]);

  useEffect(() => {
    if (loaded && !postLoadingDone) {
      setTimeout(() => {
        setPostLoadingDone(true);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <>
      {!loaded && (
        <>
          <div
            style={{
              position: "absolute",
              display: "flex",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "2",
              borderRadius: "5px",
            }}
          >
            <SpinnerDotted
              enabled={!postLoadingDone}
              style={{
                width: "25%",
                height: "25%",
                color: "var(--secondary)",
              }}
            />
          </div>
          <img
            {...placeHolderProps}
            style={{
              border: "1px solid black",
              transition: "opacity 1s",
              opacity: loaded ? "0" : "1",
              zIndex: "1",
            }}
          />
        </>
      )}

      <img
        {...imageProps}
        onLoad={() => setLoaded(true)}
        style={{
          display: loaded ? "" : "none",
          transition: "opacity 1s",
          opacity: postLoadingDone ? "1" : "0",
        }}
      />
    </>
  );
}

export default memo(LazyImage);
