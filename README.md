# My Sites

Monorepo of my personal sites, each living on their own domain:

- [About](./about) at [evan.bio](https://evan.bio)
- [Writing](./writing) at [writing.evan.bio](https://writing.evan.bio)
- [Photography](./photos) at [photos.evan.bio](https://photos.evan.bio)
- [Music (TODO)](./music) at [music.evan.bio](https://music.evan.bio)

Each page is hosted on GitHub Pages from their own repo.

Since none of these sites rely on dynamic data, each is built using Next.js and its [static-site generation](https://nextjs.org/docs/advanced-features/static-html-export).

Content management is handled by modifying asset files in this repo (e.g. markdown, json, and image files)

Pushing to `main` triggers an action that builds static files and moves them the appropriate deploy repo. Each deploy repo has a corresponding Netlify deploy that triggers when the static files are pushed. The naming scheme of each deploy repo is `ebonsignori/my-{project}` where project is one of `[about, writing, photos, music]`, e.g. [my-about](https://github.com/Ebonsignori/my-about)


Uses https://github.com/Ebonsignori/image-resize-upload-aws for local picture uploads to AWS.
