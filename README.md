# My Sites

Monorepo of my personal sites, each living on their own domain:

- [About](./about) at [evan.bio](https://evan.bio)
- [Writing](./writing) at [writing.evan.bio](https://writing.evan.bio)
- [Photography](./photos) at [photos.evan.bio](https://photos.evan.bio)
- [Music (TODO)](./music) at [music.evan.bio](https://music.evan.bio)

None of these sites rely on dynamic data, each is built using Next.js and its [static-site generation](https://nextjs.org/docs/advanced-features/static-html-export).

Each page is freely hosted using [Netlify](https://www.netlify.com/) and GitHub actions for automated deploys.

Pushing to `main` triggers the [deploy all](https://github.com/Ebonsignori/my-sites/blob/main/.github/workflows/deploy-all.yml) action which builds static files and moves them the appropriate _deploy repo_.

Each _deploy repo_ has a corresponding Netlify deploy hook that triggers when the static files are moved to them via the [deploy-all](https://github.com/Ebonsignori/my-sites/blob/main/.github/workflows/deploy-all.yml) action.

The naming scheme for each deploy repo is `ebonsignori/my-{project}`:
- [my-about](https://github.com/Ebonsignori/my-about)
- [my-writing](https://github.com/Ebonsignori/my-writing)
- [my-photos](https://github.com/Ebonsignori/my-photos)
- [my-music](https://github.com/Ebonsignori/my-music)

## Content Management

Content management is done locally by modifying asset files in this repo (e.g. markdown, json).

Images are hosted on S3 (only paid service for this project).

They are resized and uploaded locally using https://github.com/Ebonsignori/image-resize-upload-aws.

## Acknowledgements

"My Work" section inspiration: https://www.vancedesignsproducts.com/#section-about

Icons: https://fonts.google.com/icons

Shooting Star animation: https://codepen.io/YusukeNakaya/pen/XyOaBj

Sun mode shine animation: https://codepen.io/hirokbanik/pen/pozYZgP



