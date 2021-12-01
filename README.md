# My Sites

Monorepo of my personal sites, each living on their own domain:

- [About](./about) at [evan.bio](https://evan.bio)
- [Writing](./writing) at [writing.evan.bio](https://writing.evan.bio)
- [Photography](./photos) at [photos.evan.bio](https://photos.evan.bio)
- [Music (TODO)](./music) at [music.evan.bio](https://music.evan.bio)

Each page is hosted on GitHub Pages from their own repo.

Since none of these sites rely on dynamic data, all are built using Next.js and its [static-site generation](https://nextjs.org/docs/advanced-features/static-html-export).

Content management will be done by modifying asset files in this repo (e.g. markdown and image files)

Pushing to `main` triggers an action that builds and deploys each project to its own repo. The naming scheme of each repo is `ebonsignori/my-{project}` where project is one of `[about, writing, photos, music]`

Uses https://github.com/Ebonsignori/image-resize-upload-aws for local picture uploads to AWS.
