// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages preview lives under /<repo>/. Once the site moves to its own
// domain, set SITE to https://www.lukaslechner.com and BASE to '/'.
export default defineConfig({
  site: process.env.SITE ?? 'https://lukaslechnerdev.github.io',
  base: process.env.BASE ?? '/lukaslechner-website',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    },
  },
});
