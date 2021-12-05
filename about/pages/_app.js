import Head from "next/head";
import Script from "next/script";

import { BREAKPOINTS } from "../../shared/utils/breakpoints";
import { getImageSource } from "../../shared/utils/image";
import GlobalStyle from "../src/utils/global-styles";

const TRACKING_ID = "G-SK34YBMR49";

function MyApp({ Component, pageProps }) {
  const imagePreviewUrl = getImageSource(
    "stary-night-prineville-sky",
    BREAKPOINTS[2],
    true
  );
  let analytics = null;
  if (process.env.NODE_ENV === "production") {
    analytics = (
      <>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </>
    );
  }
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
      {analytics}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
