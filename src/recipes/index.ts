/**
 * @kodentuzo/spotstrap/recipes: the components as Uniwind class strings for React Native, built from the
 * same tokens as the web (docs/decisions/0002-package-and-publishing.md).
 *
 * React Native has no :hover, :checked or ::after, so state comes in as options, and small
 * targets get a `hitSlop` instead of an overlay. Every class is written out in full, since
 * Tailwind and Uniwind find classes by scanning source for literal strings; the pixel
 * values match src/tokens.css (a test checks).
 *
 *   const b = button({ variant: 'outline', pressed })
 *   <Pressable className={b.className} hitSlop={b.hitSlop}>
 *     <Text className={b.textClassName}>Export…</Text>
 *   </Pressable>
 */

import { box, compact, control, slop, switchSize } from './sizes.ts'

export * as sizes from './sizes.ts'

export interface Recipe {
  className: string
  hitSlop?: { top: number; bottom: number; left: number; right: number }
}

export interface TextRecipe extends Recipe {
  textClassName: string
}

const join = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

// Button ---------------------------------------------------------------------------------

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'

const buttonColors: Record<ButtonVariant, { box: string; text: string }> = {
  default: { box: 'bg-primary', text: 'text-primary-foreground' },
  secondary: { box: 'bg-secondary', text: 'text-secondary-foreground' },
  outline: { box: 'bg-background border border-border', text: 'text-foreground' },
  ghost: { box: 'bg-transparent', text: 'text-foreground' },
  link: { box: 'bg-transparent', text: 'text-foreground underline' },
  destructive: { box: 'bg-destructive', text: 'text-destructive-foreground' },
}

export interface ButtonOptions {
  variant?: ButtonVariant
  size?: 'default' | 'compact'
  icon?: boolean
  pressed?: boolean
  disabled?: boolean
}

export function button({
  variant = 'default',
  size = 'default',
  icon = false,
  pressed = false,
  disabled = false,
}: ButtonOptions = {}): TextRecipe {
  const height = size === 'compact' ? compact : control
  const colors = buttonColors[variant]
  return {
    className: join(
      'flex-row items-center justify-center gap-2 rounded-lg',
      icon
        ? size === 'compact'
          ? 'h-[36px] w-[36px]'
          : 'h-[44px] w-[44px]'
        : size === 'compact'
          ? 'min-h-[36px]'
          : 'min-h-[44px]',
      !icon && (variant === 'link' ? 'px-1' : size === 'compact' ? 'px-3' : 'px-4'),
      colors.box,
      pressed && 'opacity-85 scale-[0.97]',
      disabled && 'opacity-50',
    ),
    textClassName: join(
      size === 'compact' ? 'text-subhead' : 'text-body',
      'font-medium',
      colors.text,
    ),
    hitSlop: slop(icon ? height : control, height),
  }
}

// Fields ---------------------------------------------------------------------------------

export function field(): Recipe {
  return { className: 'gap-1.5' }
}

export function label({ disabled = false } = {}): Recipe {
  return { className: join('text-subhead font-medium text-foreground', disabled && 'opacity-50') }
}

export function fieldDescription(): Recipe {
  return { className: 'text-footnote text-muted-foreground' }
}

export function fieldError(): Recipe {
  return { className: 'text-footnote text-destructive' }
}

export interface InputOptions {
  focused?: boolean
  invalid?: boolean
  disabled?: boolean
  multiline?: boolean
}

/** For a TextInput. Text is 17pt (body), above the 16 iOS needs not to zoom. */
export function input({
  focused = false,
  invalid = false,
  disabled = false,
  multiline = false,
}: InputOptions = {}): Recipe {
  return {
    className: join(
      multiline ? 'min-h-[108px]' : 'min-h-[44px]',
      'px-3 py-2.5 rounded-lg border',
      'bg-background text-foreground text-body',
      invalid ? 'border-destructive' : focused ? 'border-ring' : 'border-input',
      disabled && 'opacity-50',
    ),
  }
}

// Checkbox, radio, switch ----------------------------------------------------------------

/** A row holding a control and its label; the whole row is the target. */
export function choice({ disabled = false } = {}): Recipe {
  return {
    className: join('flex-row items-center gap-3 min-h-[44px]', disabled && 'opacity-50'),
  }
}

export interface ToggleOptions {
  checked?: boolean
  disabled?: boolean
}

export function checkbox({ checked = false, disabled = false }: ToggleOptions = {}): Recipe {
  return {
    className: join(
      'h-[20px] w-[20px] items-center justify-center rounded-sm border-[1.5px]',
      checked ? 'bg-primary border-primary' : 'bg-background border-muted-foreground',
      disabled && 'opacity-50',
    ),
    hitSlop: slop(box),
  }
}

export function radio({ checked = false, disabled = false }: ToggleOptions = {}): Recipe {
  return {
    className: join(
      'h-[20px] w-[20px] items-center justify-center rounded-full border-[1.5px]',
      checked ? 'bg-primary border-primary' : 'bg-background border-muted-foreground',
      disabled && 'opacity-50',
    ),
    hitSlop: slop(box),
  }
}

/** The check or dot inside a checked checkbox or radio. */
export function toggleMark(): Recipe {
  return { className: 'text-primary-foreground' }
}

/** A switch you draw yourself; React Native's own Switch also fits the size. */
export function switchTrack({ checked = false, disabled = false }: ToggleOptions = {}): Recipe {
  return {
    className: join(
      'h-[31px] w-[51px] rounded-full p-0.5',
      checked ? 'bg-primary items-end' : 'bg-muted items-start',
      disabled && 'opacity-50',
    ),
    hitSlop: slop(switchSize.width, switchSize.height),
  }
}

export function switchThumb(): Recipe {
  return { className: 'h-[27px] w-[27px] rounded-full bg-white shadow-sm' }
}

export function radioGroup(): Recipe {
  return { className: 'gap-[12px]' }
}

// Menus, tabs, sheets --------------------------------------------------------------------

export function menu(): Recipe {
  return { className: 'p-1 rounded-lg border border-border bg-popover shadow-lg' }
}

export interface ItemOptions {
  highlighted?: boolean
  selected?: boolean
  destructive?: boolean
  disabled?: boolean
  compact?: boolean
}

export function menuItem({
  highlighted = false,
  destructive = false,
  disabled = false,
  compact: isCompact = false,
}: ItemOptions = {}): TextRecipe {
  return {
    className: join(
      'flex-row items-center gap-3 px-3 rounded-md',
      isCompact ? 'min-h-[36px]' : 'min-h-[44px]',
      highlighted && 'bg-accent',
      disabled && 'opacity-50',
    ),
    textClassName: join(
      'text-body',
      destructive
        ? 'text-destructive'
        : highlighted
          ? 'text-accent-foreground'
          : 'text-popover-foreground',
    ),
    hitSlop: isCompact ? slop(control, compact) : undefined,
  }
}

export function tabList(): Recipe {
  return { className: 'flex-row gap-1 border-b border-border' }
}

export function tab({ selected = false, disabled = false } = {}): TextRecipe {
  return {
    className: join(
      'min-h-[44px] px-3.5 items-center justify-center border-b-2',
      selected ? 'border-foreground' : 'border-transparent',
      disabled && 'opacity-50',
    ),
    textClassName: join(
      'text-body font-medium',
      selected ? 'text-foreground' : 'text-muted-foreground',
    ),
  }
}

/** The sheet a dialog becomes on a phone: at the bottom, rounded on top. */
export function sheet(): Recipe {
  return { className: 'gap-4 p-6 rounded-t-xl border border-b-0 border-border bg-popover' }
}

export function sheetTitle(): Recipe {
  return { className: 'text-title-3 font-semibold text-popover-foreground' }
}

export function sheetDescription(): Recipe {
  return { className: 'text-body text-muted-foreground' }
}

/** Sheet actions stack full width; put the primary action first, Cancel last. */
export function sheetActions(): Recipe {
  return { className: 'gap-[12px]' }
}
