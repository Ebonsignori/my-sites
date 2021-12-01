# My Sites

Monorepo of my personal sites, each living on their own domain:

- [About](./about) at [evan.bio](https://evan.bio)
- [Writing](./writing) at [writing.evan.bio](https://writing.evan.bio)
- [Photography](./photos) at [photos.evan.bio](https://photos.evan.bio)
- [Music (TODO)](./music) at [music.evan.bio](https://music.evan.bio)

Since none of these sites rely on dynamic data, each is built using Next.js and its [static-site generation](https://nextjs.org/docs/advanced-features/static-html-export).

Each page is hosted for free using [Netlify](https://www.netlify.com/) with automated deploys via GitHub.

Pushing to `main` triggers an action that builds static files and moves them the appropriate _deploy repo_.

Each _deploy repo_ has a corresponding Netlify deploy listener that triggers when the static files are pushed.

The naming scheme of each deploy repo is `ebonsignori/my-{project}` where project is one of `[about, writing, photos, music]`:
- [my-about](https://github.com/Ebonsignori/my-about).
- [my-writing](https://github.com/Ebonsignori/my-writing).
- [my-photos](https://github.com/Ebonsignori/my-photos).
- [my-music](https://github.com/Ebonsignori/my-music).

## Content Management

Content management is done locally via modifying asset files in this repo (e.g. markdown, json).

Images are hosted on S3 (only paid service for this project).

They are resized and uploaded locally using https://github.com/Ebonsignori/image-resize-upload-aws.
