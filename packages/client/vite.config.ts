
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

// Get __dirname equivalent for ESM compatibility (works on Vercel)
const __dirname = path.resolve();

import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    nodePolyfills({
      include: ['path', 'process', 'buffer', 'util', 'stream', 'events', 'https', 'http', 'os', 'crypto'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      // Exclude server-only packages from Vite's dependency pre-bundling
      '@dreamnet/inbox-squared-core',
      'googleapis',
      'googleapis-common',
      '@noble/hashes',
      '@noble/curves',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@noble/hashes/sha256': path.resolve(__dirname, './src/vendor/noble-hashes/sha256.js'),
      '@noble/hashes/sha512': path.resolve(__dirname, './src/vendor/noble-hashes/sha512.js'),
      '@noble/hashes/sha3': path.resolve(__dirname, './src/vendor/noble-hashes/sha3.js'),
      '@noble/hashes/ripemd160': path.resolve(__dirname, './src/vendor/noble-hashes/ripemd160.js'),
      '@noble/hashes/hmac': path.resolve(__dirname, './src/vendor/noble-hashes/hmac.js'),
      '@noble/hashes/pbkdf2': path.resolve(__dirname, './src/vendor/noble-hashes/pbkdf2.js'),
      '@noble/hashes/scrypt': path.resolve(__dirname, './src/vendor/noble-hashes/scrypt.js'),
      '@noble/hashes/utils': path.resolve(__dirname, './src/shims/noble-utils.ts'),
      '@noble/hashes/crypto': path.resolve(__dirname, './src/vendor/noble-hashes/crypto.js'),
      '@dreamnet/card-forge-pro': path.resolve(__dirname, '../packages/card-forge-pro'),
      '@dreamnet/ops-sentinel': path.resolve(__dirname, '../packages/ops-sentinel'),
      '@dreamnet/wolf-pack': path.resolve(__dirname, '../packages/wolf-pack'),
    },
    preserveSymlinks: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    minify: true, // Production Ready
    // experimental: {
    //   reactCompiler: true, // React 19 Support (Future Injection)
    // },
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive chunking to reduce memory usage
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Radix UI (large library)
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Solana (large)
            if (id.includes('@solana')) {
              return 'vendor-solana';
            }
            // TanStack Query
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'vendor-forms';
            }
            // Other large vendors
            if (id.includes('lucide-react') || id.includes('recharts') || id.includes('vis-network')) {
              return 'vendor-ui';
            }
            // Everything else
            return 'vendor';
          }
        },
      },
      external: [
        // Exclude server-only packages that have Node.js dependencies
        '@dreamnet/inbox-squared-core',
        'googleapis',
        'puppeteer',
        'google-trends-api',
        'newsapi',
        'timezone-lookup',
      ],
    },
    commonjsOptions: {
      include: [/node_modules/, /packages/],
      exclude: [/@noble\/hashes/, /@noble\/curves/],
    },
  },
});
