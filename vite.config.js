import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '127.0.0.1', port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:3001' } },
  build: { rolldownOptions: { onwarn(warning, defaultHandler) {
    // Application entièrement cliente : les directives React Server Components de MUI sont sans effet.
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
    defaultHandler(warning);
  } } },
});
