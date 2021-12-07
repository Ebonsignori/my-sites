import Head from "next/head";

import Analytics from "../../shared/components/analytics";
import { BREAKPOINTS } from "../../shared/utils/breakpoints";
import { getImageSource } from "../../shared/utils/image";
import GlobalStyle from "../src/utils/global-styles";

function MyApp({ Component, pageProps }) {
  // TODO: Use different image for music site
  const imagePreviewUrl = getImageSource(
    "stary-night-prineville-sky",
    BREAKPOINTS[2],
    true
  );
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Music - Evan Bonsignori</title>
        <meta name="description" content="The music of Evan Bonsignori" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Music - Evan Bonsignori" />
        <meta property="og:type" content="image/jpeg" />
        <meta property="og:image" content={imagePreviewUrl} />
        <meta property="og:image:secure_url" content={imagePreviewUrl} />
        <meta property="og:image:alt" content="Night sky with stars" />
      </Head>
      <Analytics trackingId={process.env.MUSIC_TRACKING_ID} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
