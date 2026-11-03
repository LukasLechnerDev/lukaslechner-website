// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served from the custom domain at the root. Override SITE/BASE for a
// sub-path preview build.
const site = process.env.SITE ?? 'https://www.lukaslechner.com';
const base = process.env.BASE ?? '/';
// Full URLs: Astro neither adds the base nor (wrongly, for rss.xml) a trailing slash to them.
const to = (path) => new URL(base.replace(/\/?$/, '/') + path, site).href;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Old WordPress URLs from lukaslechner.com that have no 1:1 page here.
  redirects: {
    '/feed': to('rss.xml'),
    '/why-we-use-kotlin-for-android-application-development': to('blog/'),
    '/coroutines-on-android': to('course/'),
    '/talk-at-appsfest-hardfest-why-exception-handling-with-kotlin-coroutines-is-hard-and-how-to-master-it': to('talks/'),
    '/talk-at-droidcon-americas-why-exception-handling-with-kotlin-coroutines-is-hard-and-how-to-master-it': to('talks/'),
    '/talk-at-droidcon-emea-why-exception-handling-with-kotlin-coroutines-is-hard-and-how-to-master-it': to('talks/'),
    '/hire-me': to('about/'),
    '/contact': to('about/'),
    '/newsletter': to(''),
    '/tag/android': to('blog/'),
    '/tag/kotlin': to('blog/'),
    '/tag/java': to('blog/'),
    '/tag/books': to('blog/'),
    '/tag/conference': to('talks/'),
    '/tag/presentations': to('talks/'),
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    },
  },
});
