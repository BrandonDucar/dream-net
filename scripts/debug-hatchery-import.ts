import path from 'path';
import fs from 'fs';

const aiFactoryPath = 'c:/dev/dream-net/packages/organs/reproductive/dreamnet-factory/src/aiFactory.ts';
const targetRegistryPath = 'c:/dev/dream-net/packages/organs/integumentary/server/src/agents/core/registry.ts';

console.log(`[Diagnostic] Source: ${aiFactoryPath}`);
console.log(`[Diagnostic] Target: ${targetRegistryPath}`);

const relativePath = path.relative(path.dirname(aiFactoryPath), targetRegistryPath).replace(/\\/g, '/');
console.log(`[Diagnostic] Calculated Relative Path: ${relativePath}`);

// Test dynamic import logic
try {
    // Note: We can't easily test the import here without tsx, but we can verify file existence
    const absoluteTarget = path.resolve(path.dirname(aiFactoryPath), '../../../integumentary/server/src/agents/core/registry.ts');
    console.log(`[Diagnostic] Verify 3-hop: ${absoluteTarget} exists: ${fs.existsSync(absoluteTarget)}`);

    const absoluteTarget4 = path.resolve(path.dirname(aiFactoryPath), '../../../../organs/integumentary/server/src/agents/core/registry.ts');
    console.log(`[Diagnostic] Verify 4-hop with 'organs': ${absoluteTarget4} exists: ${fs.existsSync(absoluteTarget4)}`);
} catch (e) {
    console.error(e);
}
