# lukaslechner.com

Personal website and blog of Lukas Lechner, built with [Astro](https://astro.build).

## Development

```sh
npm install
npm run dev      # http://localhost:4321/lukaslechner-website/
npm run build    # output in dist/
```

## Writing a post

Add a Markdown file to `src/content/blog/`. The filename becomes the URL slug.

```md
---
title: "My new post"
date: 2026-09-21
description: "One or two sentences shown in listings and meta tags."
tags: ["Kotlin", "Coroutines"]
---
```

Put images in `src/assets/blog/` and reference them relatively
(`![alt](../../assets/blog/image.png)`) so Astro optimizes them.

## Deployment

Every push to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.
The preview is served under `/lukaslechner-website/`. When moving to the custom domain,
set `SITE=https://www.lukaslechner.com` and `BASE=/` (see `astro.config.mjs`).
