import Head from "next/head";

import Analytics from "../../shared/components/analytics";
import GlobalStyle from "../src/utils/global-styles";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Analytics trackingId={process.env.PHOTOS_TRACKING_ID} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
