/**
 * @kodentuzo/spotstrap/js: keyboard and ARIA behavior for Menu, Listbox, Combobox
 * and Tabs, built on Zag.js state machines (docs/decisions/0004-style-state-not-runtime.md).
 * Framework apps keep their own headless library and don't need this.
 *
 *   <script type="module">
 *     import { init } from "@kodentuzo/spotstrap/js"
 *     init()
 *   </script>
 *
 * Components are found by `data-spotstrap="menu|listbox|combobox|tabs"` and their parts by
 * `data-part="…"`. A menu written with `popover` and `commandfor` works without this
 * script; init() swaps those for Zag's behavior.
 */

import * as combobox from '@zag-js/combobox'
import * as menu from '@zag-js/menu'
import * as select from '@zag-js/select'
import * as tabs from '@zag-js/tabs'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'

export type Cleanup = () => void

let count = 0
const nextId = (kind: string) => `spotstrap-${kind}-${++count}`

/** The parts that belong to this component, not to one nested inside it. */
function parts(root: Element, name: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(`[data-part="${name}"]`)].filter(
    (el) => el.closest('[data-spotstrap]') === root,
  )
}

function part(root: Element, name: string): HTMLElement {
  const el = parts(root, name)[0]
  if (!el)
    throw new Error(`spotstrap: ${root.getAttribute('data-spotstrap')} needs a data-part="${name}"`)
  return el
}

/** Zag positions a wrapper around the content; add one when the markup has none. */
function positioner(root: Element, content: HTMLElement): HTMLElement {
  const existing = parts(root, 'positioner')[0]
  if (existing) return existing
  const wrapper = document.createElement('div')
  wrapper.dataset.part = 'positioner'
  content.before(wrapper)
  wrapper.append(content)
  return wrapper
}

/** Drop the no-script fallback: Zag opens, closes and positions the content now. */
function dropNativePopover(trigger: HTMLElement, content: HTMLElement) {
  for (const attr of ['commandfor', 'command', 'popovertarget']) trigger.removeAttribute(attr)
  content.removeAttribute('popover')
}

/** One option per `[data-part="item"]`: its value, its text, and whether it's disabled. */
function items(root: Element) {
  return parts(root, 'item').map((el) => ({
    el,
    value: el.dataset.value ?? el.textContent?.trim() ?? '',
    label: el.dataset.label ?? el.textContent?.trim() ?? '',
    disabled: el.hasAttribute('data-disabled') || el.getAttribute('aria-disabled') === 'true',
  }))
}

type Item = ReturnType<typeof items>[number]

/** Root props without Zag's id, so the page's own id on the component stays. */
function rootProps(props: Record<string, unknown>): Record<string, unknown> {
  const { id: _, ...rest } = props
  return rest
}

function emit(root: Element, name: string, detail: unknown) {
  root.dispatchEvent(new CustomEvent(`spotstrap:${name}`, { bubbles: true, detail }))
}

function run<S extends { service: unknown }>(
  machine: S & { start(): void; stop(): void; subscribe(fn: () => void): () => void },
  render: () => void,
): Cleanup {
  machine.start()
  render()
  const unsubscribe = machine.subscribe(render)
  return () => {
    unsubscribe()
    machine.stop()
  }
}

function initMenu(root: HTMLElement): Cleanup {
  const trigger = part(root, 'trigger')
  const content = part(root, 'content')
  dropNativePopover(trigger, content)
  const wrapper = positioner(root, content)
  const machine = new VanillaMachine(menu.machine, {
    id: root.id || nextId('menu'),
    onSelect: ({ value }) => emit(root, 'select', { value }),
  })
  return run(machine, () => {
    const api = menu.connect(machine.service, normalizeProps)
    spreadProps(trigger, api.getTriggerProps())
    spreadProps(wrapper, api.getPositionerProps())
    spreadProps(content, api.getContentProps())
    for (const item of items(root)) {
      spreadProps(item.el, api.getItemProps({ value: item.value, disabled: item.disabled }))
    }
  })
}

function initListbox(root: HTMLElement): Cleanup {
  const all = items(root)
  const trigger = part(root, 'trigger')
  const content = part(root, 'content')
  const wrapper = positioner(root, content)
  const valueText = parts(root, 'value-text')[0]
  const label = parts(root, 'label')[0]
  // A hidden <select> carries the value in forms; it needs an option per item.
  const hidden = document.createElement('select')
  for (const i of all) hidden.append(new Option(i.label, i.value))
  root.append(hidden)
  const selected = all.filter((i) => i.el.hasAttribute('data-selected')).map((i) => i.value)
  const machine = new VanillaMachine(select.machine, {
    id: root.id || nextId('listbox'),
    name: root.dataset.name,
    defaultValue: selected,
    collection: select.collection<Item>({
      items: all,
      itemToValue: (i) => i.value,
      itemToString: (i) => i.label,
      isItemDisabled: (i) => i.disabled,
    }),
    onValueChange: ({ value }) => emit(root, 'change', { value }),
  })
  for (const i of all) i.el.removeAttribute('data-selected')
  return run(machine, () => {
    const api = select.connect(machine.service, normalizeProps)
    spreadProps(root, rootProps(api.getRootProps()))
    if (label) spreadProps(label, api.getLabelProps())
    spreadProps(trigger, api.getTriggerProps())
    if (valueText) {
      spreadProps(valueText, api.getValueTextProps())
      valueText.textContent = api.valueAsString || valueText.dataset.placeholder || ''
    }
    spreadProps(wrapper, api.getPositionerProps())
    spreadProps(content, api.getContentProps())
    spreadProps(hidden, api.getHiddenSelectProps())
    for (const item of all) spreadProps(item.el, api.getItemProps({ item }))
  })
}

function initCombobox(root: HTMLElement): Cleanup {
  const all = items(root)
  const input = part(root, 'input') as HTMLInputElement
  const control = parts(root, 'control')[0] ?? input.parentElement ?? root
  const content = part(root, 'content')
  const wrapper = positioner(root, content)
  const label = parts(root, 'label')[0]
  const empty = parts(root, 'empty')[0]
  const collectionOf = (list: Item[]) =>
    combobox.collection<Item>({
      items: list,
      itemToValue: (i) => i.value,
      itemToString: (i) => i.label,
      isItemDisabled: (i) => i.disabled,
    })
  const matches = (query: string) => {
    const q = query.trim().toLocaleLowerCase()
    return q ? all.filter((i) => i.label.toLocaleLowerCase().includes(q)) : all
  }
  const machine = new VanillaMachine(combobox.machine, {
    id: root.id || nextId('combobox'),
    name: root.dataset.name,
    collection: collectionOf(all),
    openOnClick: true,
    onInputValueChange: ({ inputValue }) => {
      machine.updateProps({ collection: collectionOf(matches(inputValue)) })
    },
    onValueChange: ({ value }) => emit(root, 'change', { value }),
  })
  return run(machine, () => {
    const api = combobox.connect(machine.service, normalizeProps)
    const shown = new Set(matches(api.inputValue).map((i) => i.value))
    spreadProps(root, rootProps(api.getRootProps()))
    if (label) spreadProps(label, api.getLabelProps())
    spreadProps(control, api.getControlProps())
    spreadProps(input, api.getInputProps())
    spreadProps(wrapper, api.getPositionerProps())
    spreadProps(content, api.getContentProps())
    for (const item of all) {
      spreadProps(item.el, api.getItemProps({ item }))
      item.el.hidden = !shown.has(item.value)
    }
    if (empty) empty.hidden = shown.size > 0
  })
}

function initTabs(root: HTMLElement): Cleanup {
  const list = part(root, 'list')
  const triggers = parts(root, 'trigger')
  const panels = parts(root, 'content')
  const value = (el: HTMLElement) => el.dataset.value ?? ''
  const selected = triggers.find((t) => t.hasAttribute('data-selected')) ?? triggers[0]
  const machine = new VanillaMachine(tabs.machine, {
    id: root.id || nextId('tabs'),
    defaultValue: selected ? value(selected) : null,
    onValueChange: ({ value }) => emit(root, 'change', { value }),
  })
  for (const t of triggers) t.removeAttribute('data-selected')
  return run(machine, () => {
    const api = tabs.connect(machine.service, normalizeProps)
    spreadProps(root, rootProps(api.getRootProps()))
    spreadProps(list, api.getListProps())
    for (const t of triggers) spreadProps(t, api.getTriggerProps({ value: value(t) }))
    for (const p of panels) spreadProps(p, api.getContentProps({ value: value(p) }))
  })
}

const kinds: Record<string, (root: HTMLElement) => Cleanup> = {
  tabs: initTabs,
  menu: initMenu,
  listbox: initListbox,
  combobox: initCombobox,
}

const started = new WeakMap<Element, Cleanup>()

/** Starts every component under `root` that isn't running yet. Returns a function that stops them. */
export function init(root: ParentNode = document): Cleanup {
  const cleanups: Cleanup[] = []
  for (const el of root.querySelectorAll<HTMLElement>('[data-spotstrap]')) {
    const start = kinds[el.dataset.spotstrap ?? '']
    if (!start || started.has(el)) continue
    const stop = start(el)
    started.set(el, stop)
    cleanups.push(() => {
      stop()
      started.delete(el)
    })
  }
  return () => {
    for (const stop of cleanups) stop()
  }
}
