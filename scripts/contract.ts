// The token contract (docs/decisions/0001-token-contract.md): every theme defines exactly
// these, in `@theme` and again under `@variant light` and `@variant dark` for colors.

export const colors = [
  'background',
  'foreground',
  'surface',
  'raised',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const

export const fonts = ['sans', 'display', 'mono'] as const

export const radii = ['', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const

/** Optional: a theme may turn shadows off by setting all of these to `none`. */
export const shadows = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

export const themes = [
  'neutral',
  'kodentuzo',
  'librevitalis',
  'librelifts',
  'spotcraft',
  'sokobanko',
  'tagtape',
  'vinskiano',
] as const
