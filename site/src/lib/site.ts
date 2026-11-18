import pkg from '../../../package.json' with { type: 'json' }

export const SITE_NAME = 'spotstrap'
export const VERSION: string = pkg.version
export const GITHUB = 'https://github.com/kodentuzo/spotstrap'
/** The repository at this release, for "view source" links. */
export const GITHUB_AT_VERSION = `${GITHUB}/blob/v${VERSION}`
export const DESCRIPTION =
  "Bootstrap's reach, shadcn's look, made for phones: a Tailwind v4 UI library that works in plain HTML, every web framework and React Native."
