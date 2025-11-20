
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ESM compatibility (works on Vercel)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for specific modules
      include: ['buffer', 'process', 'util', 'stream', 'events'],
    }),
  ],
  optimizeDeps: {
    exclude: [
      // Exclude server-only packages from Vite's dependency pre-bundling
      '@dreamnet/inbox-squared-core',
      'googleapis',
      'googleapis-common',
    ],
    include: [
      // Explicitly include problematic transitive dependencies
      'regexparam',
      'use-sync-external-store/shim/index.js',
      '@tanstack/query-core',
      'buffer',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@dreamnet/base-mini-apps': path.resolve(__dirname, '../packages/base-mini-apps/frontend'),
      // Resolve @dreamnet/* packages to their package directories (Vite will resolve via package.json main/types)
      '@dreamnet/shield-core': path.resolve(__dirname, '../packages/shield-core'),
      '@dreamnet/api-keeper-core': path.resolve(__dirname, '../packages/api-keeper-core'),
      '@dreamnet/economic-engine-core': path.resolve(__dirname, '../packages/economic-engine-core'),
      '@dreamnet/wolfpack-funding-core': path.resolve(__dirname, '../packages/wolfpack-funding-core'),
      '@dreamnet/jaggy-core': path.resolve(__dirname, '../packages/jaggy-core'),
      '@dreamnet/whale-pack-core': path.resolve(__dirname, '../packages/whale-pack-core'),
      // Removed @dreamnet/inbox-squared-core - server-only package with googleapis dependency
      // Frontend should use API endpoints instead of importing this package
      '@dreamnet/dream-state-core': path.resolve(__dirname, '../packages/dream-state-core'),
      '@dreamnet/webhook-nervous-core': path.resolve(__dirname, '../packages/webhook-nervous-core'),
      '@dreamnet/dreamnet-snail-core': path.resolve(__dirname, '../packages/dreamnet-snail-core'),
    },
    preserveSymlinks: true,
    dedupe: ['react', 'react-dom'],
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/, /packages/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [
        // Exclude server-only packages that have Node.js dependencies
        '@dreamnet/inbox-squared-core',
        'googleapis',
        'puppeteer',
        'google-trends-api',
        'newsapi',
        'timezone-lookup',
      ],
      onwarn(warning, warn) {
        // Suppress "unresolved dependencies" warnings for transitive deps
        if (warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        warn(warning);
      },
    },
  },
});
