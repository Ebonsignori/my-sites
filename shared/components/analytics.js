import Script from "next/script";

export default function Analytics({ trackingId }) {
  let analytics = null;
  if (process.env.NODE_ENV === "production") {
    analytics = (
      <>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
              // For GDPR compliance
              'anonymize_ip': true
            });
          `,
          }}
        />
      </>
    );
  }

  return analytics;
}
