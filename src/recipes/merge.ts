/**
 * spotstrap/merge: a tailwind-merge config for spotstrap's class names.
 *
 * tailwind-merge doesn't know `text-body` or `text-title-1`, so it takes them for text colors
 * and drops one when a color follows (`cn('text-body text-foreground')` loses the size). Extend
 * it with this config:
 *
 *   import { extendTailwindMerge } from 'tailwind-merge'
 *   import { spotstrapMerge } from '@kodentuzo/spotstrap/merge'
 *   const twMerge = extendTailwindMerge(spotstrapMerge)
 *
 * With the `cn` package: `createCn(spotstrapMerge)`.
 */

/** spotstrap's type scale (src/tokens.css), without the `text-` prefix. */
export const textSizes = [
  'large-title',
  'title-1',
  'title-2',
  'title-3',
  'headline',
  'body',
  'callout',
  'subhead',
  'footnote',
  'caption-1',
  'caption-2',
] as const

export const spotstrapMerge = {
  extend: {
    classGroups: {
      'font-size': [{ text: [...textSizes] }],
    },
  },
}
