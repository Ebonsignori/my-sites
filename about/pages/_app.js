import Head from "next/head";

import { BREAKPOINTS } from "../../shared/utils/breakpoints";
import { getImageSource } from "../../shared/utils/image";
import GlobalStyle from "../src/utils/global-styles";

function MyApp({ Component, pageProps }) {
  const imagePreviewUrl = getImageSource(
    "stary-night-prineville-sky",
    BREAKPOINTS[2],
    true
  );
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Evan Bonsignori</title>
        <meta name="description" content="About page for Evan Bonsignori" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="About Evan Bonsignori" />
        <meta property="og:type" content="image/jpeg" />
        <meta property="og:image" content={imagePreviewUrl} />
        <meta property="og:image:secure_url" content={imagePreviewUrl} />
        <meta property="og:image:alt" content="Night sky with stars" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
