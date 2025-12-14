
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ESM compatibility (works on Vercel)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      // Exclude server-only packages from Vite's dependency pre-bundling
      '@dreamnet/inbox-squared-core',
      'googleapis',
      'googleapis-common',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@dreamnet/base-mini-apps': path.resolve(__dirname, '../packages/base-mini-apps/frontend'),
      // Stub out Node.js-only packages that shouldn't be in client bundle
      'googleapis': path.resolve(__dirname, './src/stubs/googleapis-stub.ts'),
      'googleapis-common': path.resolve(__dirname, './src/stubs/googleapis-stub.ts'),
      'google-auth-library': path.resolve(__dirname, './src/stubs/googleapis-stub.ts'),
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
      // Ensure wagmi and viem resolve from client's node_modules (not packages/base-mini-apps/node_modules)
      'wagmi': path.resolve(__dirname, './node_modules/wagmi'),
      'viem': path.resolve(__dirname, './node_modules/viem'),
      '@wagmi/core': path.resolve(__dirname, './node_modules/@wagmi/core'),
      // Ensure Radix UI packages resolve from root node_modules (hoisted by pnpm)
      '@radix-ui/react-visually-hidden': path.resolve(__dirname, '../node_modules/@radix-ui/react-visually-hidden'),
      '@radix-ui/react-select': path.resolve(__dirname, '../node_modules/@radix-ui/react-select'),
    },
    preserveSymlinks: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
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
            // Web3 libraries (large)
            if (id.includes('wagmi') || id.includes('viem') || id.includes('@wagmi') || id.includes('ethers')) {
              return 'vendor-web3';
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
          // Split large local packages
          if (id.includes('packages/base-mini-apps')) {
            return 'mini-apps';
          }
        },
      },
      external: [
        // Exclude server-only packages that have Node.js dependencies
        '@dreamnet/inbox-squared-core',
        'googleapis',
        'googleapis-common',
        'google-auth-library',
        'gaxios',
        'gcp-metadata',
        'gtoken',
        'puppeteer',
        'google-trends-api',
        'newsapi',
        'timezone-lookup',
      ],
    },
    commonjsOptions: {
      include: [/node_modules/, /packages/],
    },
  },
});
