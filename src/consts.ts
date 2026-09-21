export const SITE_TITLE = 'Lukas Lechner';
export const SITE_DESCRIPTION =
  'Freelance Android developer, course creator, blogger and speaker. Writing about Kotlin, Coroutines and Flow.';

export const COURSE_URL = 'https://lukaslechner.com/coroutines-flow-android?source=website';

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/LukasLechnerDev' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCr9FeEqCspjGTiOc3HplCqw' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lukas-lechner-58287471/' },
  { label: 'Twitter', href: 'https://twitter.com/LukasLechnerDev' },
  { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/2660462/lukle' },
  { label: 'Email', href: 'mailto:contact@lukaslechner.com' },
];

/** Prefix an internal path with the configured base, e.g. url('blog/') */
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
