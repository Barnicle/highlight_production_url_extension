import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = resolve(filename, '..')

export default defineConfig({
  plugins: [crx({ manifest })],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(dirname, 'src/popup.html'),
        options: resolve(dirname, 'src/options.html')
      }
    }
  }
})
