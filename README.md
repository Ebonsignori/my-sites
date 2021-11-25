# My Sites

Monorepo of my personal sites, each living on their own domain:

- [About](#about) at [TODO.com]()
- [Writing (TODO)](#writing) at [TODO.com]()
- [Photos (TODO)](#photos) at [TODO.com]()
- [Music (TODO)](#music) at [TODO.com]()

Each page is hosted on GitHub Pages.

Since none of these sites rely on dynamic data, all are built using Next.js and its [static-site generation](https://nextjs.org/docs/advanced-features/static-html-export).

Content management will be done by modifying asset files in this repo (e.g. markdown and image files) and deployments automated on push via GitHub actions.


## [About](./about)

Landing page for "about me" content. All pages will link back to this page, and this page links out to all pages.

#### Assets

- [content.json](./about/content.json): Configurable fields for personal info that may change (e.g. `currentCompany`) 


## [Writing](./writing)

[TODO.com]()

A blog on no particular theme for all writing content.

#### Assets

- [entries/](./writing/entries/): Markdown content for blog entires


## [Photos](./photos)

[TODO.com]()

Feed of freely-downloadable photos. Photos are served as assets from this repo.

#### Assets

- [images/](./photos/images/): Asset images


## [Music](./music)

TODO
