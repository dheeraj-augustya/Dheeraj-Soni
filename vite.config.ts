import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function externalImportmapThree(): Plugin {
  return {
    name: 'external-importmap-three',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'three') {
        return {
          id: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
          external: true,
        };
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [externalImportmapThree()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        external: ['three', 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'],
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
