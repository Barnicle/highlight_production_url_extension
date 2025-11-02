# Highlight Production URL - Vite + TypeScript Extension

Key files:

- `public/manifest.json` - extension manifest
- `src/` - source TypeScript and HTML files
- `vite.config.ts` - Vite config using `vite-plugin-crx` to bundle MV3

Quick start

1. Install dependencies

```bash
npm install
```

2. Development (the plugin will build an extension in `dist`)

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Load the `dist` folder in Chrome (Extensions -> Load unpacked)
