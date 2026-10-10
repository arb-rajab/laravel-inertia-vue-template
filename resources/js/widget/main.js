import { createApp } from 'vue'
import ExampleWidget from './ExampleWidget.vue'

// Entry point for the standalone widget.js bundle (see vite.widget.config.js).
// Exposes a plain global, not an ES module export, because a third-party page
// embeds this through a classic <script src> tag, not a bundler import.
function mount(selector, options = {}) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector

  if (!el) {
    throw new Error(`starter-app widget: no element matched "${selector}"`)
  }

  const app = createApp(ExampleWidget, options)
  app.mount(el)
  return app
}

window.StarterAppWidget = { mount }
