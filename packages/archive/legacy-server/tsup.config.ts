import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    target: 'node20',
    clean: true, // Clean dist folder
    sourcemap: true,
    bundle: true,
    // Bundle all @dreamnet packages to avoid symlink/workspace issues in Docker
    noExternal: [/^@dreamnet\//],
    // Keep standard dependencies external (installed via pnpm in Docker)
    skipNodeModulesBundle: true,
    outDir: 'dist',
    // Ensure we don't shim __dirname incorrectly if target is node
    shims: true,
    esbuildOptions(options) {
        // Prioritize 'source' field in package.json to bundle directly from TS
        options.conditions = ['source', 'import', 'module', 'default'];
    }
});
