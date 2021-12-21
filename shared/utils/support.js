import { useEffect, useState } from "react";

export default function useSupport() {
  const [supportsWebp, setSupportsWebp] = useState(undefined);
  useEffect(() => {
    let webpSupported = true;
    if (typeof supportsWebp === "undefined" && typeof window !== "undefined") {
      const elem = document.createElement("canvas");

      if (elem.getContext && elem.getContext("2d")) {
        // was able or not to get WebP representation
        webpSupported =
          elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
        setSupportsWebp();
      } else {
        // very old browser like IE 8, canvas not supported
        webpSupported = false;
      }

      setSupportsWebp(webpSupported);
      if (!webpSupported) {
        alert(
          // eslint-disable-next-line max-len
          "webp images not supported on your browser. Load times will be slow. Please use Google Chrome or an up to date Safari browser."
        );
      }
    }
  }, [supportsWebp, setSupportsWebp]);

  return { supportsWebp };
}
