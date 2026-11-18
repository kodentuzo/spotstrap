// The prebuilt themes, emitted as files, so an example can switch between them.
import kodentuzo from 'spotstrap/dist/themes/kodentuzo.css?url'
import librelifts from 'spotstrap/dist/themes/librelifts.css?url'
import librevitalis from 'spotstrap/dist/themes/librevitalis.css?url'
import neutral from 'spotstrap/dist/themes/neutral.css?url'
import sokobanko from 'spotstrap/dist/themes/sokobanko.css?url'
import spotcraft from 'spotstrap/dist/themes/spotcraft.css?url'
import tagtape from 'spotstrap/dist/themes/tagtape.css?url'
import vinskiano from 'spotstrap/dist/themes/vinskiano.css?url'

export const THEME_URLS: Record<string, string> = {
  neutral,
  kodentuzo,
  librevitalis,
  librelifts,
  spotcraft,
  sokobanko,
  tagtape,
  vinskiano,
}

export const THEMES = Object.keys(THEME_URLS)
