# My Sites

Monorepo of my personal sites, each living on their own domain:

- [About](#about) at [evan.bio](https://evan.bio)
- [Writing](#writing) at [writing.evan.bio](https://writing.evan.bio)
- [Photography](#photography) at [photos.evan.bio](https://photos.evan.bio)
- [Music (TODO)](#music) at [music.evan.bio](https://music.evan.bio)

Each page is hosted on GitHub Pages from their own repo.

Since none of these sites rely on dynamic data, all are built using Next.js and its [static-site generation](https://nextjs.org/docs/advanced-features/static-html-export).

Content management will be done by modifying asset files in this repo (e.g. markdown and image files)

Pushing to `main` triggers an action that builds and deploys each project to its own repo. The naming scheme of each repo is `ebonsignori/my-{project}` where project is one of `[about, writing, photos, music]`

Uses https://github.com/Ebonsignori/image-resize-upload-aws for local picture uploads to AWS.


## [About](./about)

Landing page for "about me" content. All pages will link back to this page, and this page links out to all pages.

#### Assets

- [content.json](./about/content.json): Configurable fields for personal info that may change (e.g. `currentCompany`) 


## [Writing](./writing)


A blog on no particular theme for all writing content.

#### Assets

- [entries/](./writing/entries/): Markdown content for blog entires


## [Photography](./photos)


Feed of freely-downloadable photos. Photos are served as assets from this repo.

#### Assets

- [images/](./photos/images/): Asset images


## [Music](./music)

TODO
