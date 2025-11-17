import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import { dirname, resolve } from 'path';

export default defineConfig({
  plugins: [crx({ manifest })],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      input: {
        popup: resolve(dirname('./'), 'src/popup.html'),
      },
    },
  },
});
