# Photos

Responsive Photo feed with freely downloadable photos. Uses resized images, SEO, and analytics.

Images are served from S3 and uploaded using the local [uploader](../uploader) tool.

## Catalogue.json

The feed of photos and meta data needed for sorting them is stored in S3 as a `catalogue.json` file.

It's maintained and automatically updated by the [uploader](../uploader) tool when new photos are added.

At build time, the [deploy-all.yml](../.github/workflows/deploy-all.yml) updates the catalogue before building.

