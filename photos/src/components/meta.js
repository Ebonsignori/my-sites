import Head from "next/head";

import { BREAKPOINTS } from "../../../shared/utils/breakpoints";
import { getImageSource } from "../../../shared/utils/image";

export default function Meta({
  title,
  description,
  keywords,
  image,
  imageAlt,
  type = "article",
  imageIsAsset = true,
}) {
  let imagePreviewUrl = image;
  if (!image?.includes("https://")) {
    imagePreviewUrl = getImageSource(image, BREAKPOINTS[2], imageIsAsset);
  }
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imagePreviewUrl} />
      <meta property="og:image:secure_url" content={imagePreviewUrl} />
      <meta property="og:image:alt" content={imageAlt} />
    </Head>
  );
}
