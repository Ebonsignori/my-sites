import Head from "next/head";

import GlobalStyle from "../src/utils/global-styles";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Evan Bonsignori</title>
        <meta
          name="description"
          content="About landing page for Evan Bonsignori"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
