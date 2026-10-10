import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// A separate, standalone build for the embeddable widget (see
// resources/js/widget/). It deliberately does NOT go through
// laravel-vite-plugin / vite.config.js: that pipeline produces
// content-hashed, manifest-keyed assets loaded through Laravel's @vite()
// Blade directive, which only works for pages this application renders. A
// third-party site embedding the widget has no Blade template and no
// manifest: it needs one stable, predictable URL to hardcode in a
// <script src> tag. Vite's library mode with a fixed filename
// (public/widget.js, IIFE format, no hash) provides that;
// laravel-vite-plugin has no library-mode option.
export default defineConfig({
  plugins: [vue()],
  // Library mode skips Vite's usual app-build assumptions, including
  // replacing process.env.NODE_ENV. Vue's bundler-targeted build checks that
  // at runtime, so without this define it throws "process is not defined" in
  // a real browser and never mounts.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  // This build's outDir IS public/. publicDir is Vite's separate "copy
  // verbatim" directory and would otherwise default to the same folder, which
  // Vite warns about even though it is intentional here.
  publicDir: false,
  build: {
    outDir: 'public',
    emptyOutDir: false,
    lib: {
      entry: 'resources/js/widget/main.js',
      name: 'StarterAppWidget',
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
  },
})
