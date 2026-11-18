// The toolbar around each example: theme, scheme and width switch the iframe; Copy copies the
// HTML. The iframe grows to the height its page reports.

const PHONE = 375

export function setUpExamples() {
  for (const figure of document.querySelectorAll<HTMLElement>('[data-example]')) {
    const frame = figure.querySelector<HTMLIFrameElement>('iframe')
    if (!frame) continue
    const base = frame.getAttribute('src') ?? ''
    const minHeight = Number(frame.dataset.minHeight ?? 160)
    // `page` follows this page's own light or dark, including its toggle.
    const state = { theme: 'neutral', scheme: 'page' }
    frame.style.height = `${minHeight}px`
    const pageScheme = () =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'

    const reload = () => {
      const params = new URLSearchParams()
      if (state.theme !== 'neutral') params.set('theme', state.theme)
      params.set('scheme', state.scheme === 'page' ? pageScheme() : state.scheme)
      frame.src = `${base}?${params}`
    }
    reload()
    new MutationObserver(() => {
      if (state.scheme === 'page') reload()
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const press = (attr: string, value: string) => {
      for (const b of figure.querySelectorAll<HTMLButtonElement>(`[${attr}]`)) {
        b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value))
      }
    }

    figure
      .querySelector<HTMLSelectElement>('[data-example-theme]')
      ?.addEventListener('change', (e) => {
        state.theme = (e.target as HTMLSelectElement).value
        reload()
      })
    for (const b of figure.querySelectorAll<HTMLButtonElement>('[data-example-scheme]')) {
      b.addEventListener('click', () => {
        state.scheme = b.dataset.exampleScheme ?? 'page'
        press('data-example-scheme', state.scheme)
        reload()
      })
    }
    for (const b of figure.querySelectorAll<HTMLButtonElement>('[data-example-width]')) {
      b.addEventListener('click', () => {
        const phone = b.dataset.exampleWidth === 'phone'
        frame.style.width = phone ? `${PHONE}px` : '100%'
        frame.classList.toggle('border-x', phone)
        press('data-example-width', phone ? 'phone' : 'full')
      })
    }
    figure
      .querySelector<HTMLButtonElement>('[data-example-copy]')
      ?.addEventListener('click', async (e) => {
        const button = e.currentTarget as HTMLButtonElement
        const code = figure.querySelector('pre')?.textContent ?? ''
        try {
          await navigator.clipboard.writeText(code)
          button.textContent = 'Copied'
        } catch {
          button.textContent = 'Press ⌘C'
        }
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 1500)
      })

    window.addEventListener('message', (e) => {
      if (e.origin !== location.origin || e.source !== frame.contentWindow) return
      if (e.data?.type === 'spotstrap-example') {
        frame.style.height = `${Math.max(minHeight, e.data.height)}px`
      }
    })
  }
}
