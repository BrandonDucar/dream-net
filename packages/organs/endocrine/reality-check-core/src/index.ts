import fs from 'fs-extra';
import path from 'path';

interface RealityDrift {
    taskId: string;
    description: string;
    expectedPath?: string;
    status: 'MISSING' | 'STUB' | 'EXISTS';
    details: string;
}

interface ScanResult {
    score: number;
    totalItems: number;
    missingItems: number;
    stubItems: number;
    drifts: RealityDrift[];
}

export class RealityCheck {
    private rootPath: string;

    constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    /**
     * Scans the task.md file and validates documented completions against the file system.
     */
    async scan(taskFilePath: string): Promise<ScanResult> {
        const drifts: RealityDrift[] = [];
        if (!fs.existsSync(taskFilePath)) {
            throw new Error(`Task file not found: ${taskFilePath}`);
        }

        const content = fs.readFileSync(taskFilePath, 'utf-8');
        const lines = content.split('\n');

        let totalItems = 0;

        // Simple parser for "- [x] ... `path` ..." lines
        for (const line of lines) {
            if (line.includes('- [x]')) {
                totalItems++;

                // Extract potential paths (naive regex for backticks or package names)
                const pathMatch = line.match(/`([^`]+)`/);

                if (pathMatch) {
                    const mentionedPath = pathMatch[1];
                    // Heuristic: If it looks like a file path or package name
                    if (mentionedPath.includes('/') || mentionedPath.startsWith('packages') || mentionedPath.startsWith('server') || mentionedPath.startsWith('client')) {
                        const fullPath = path.join(this.rootPath, mentionedPath);

                        // Check Existence
                        if (!fs.existsSync(fullPath)) {
                            // Try adding package prefix if it's just a package name
                            let alternativePath = fullPath;
                            if (!mentionedPath.includes('/') && !mentionedPath.includes('.')) {
                                // It might be a package name like 'forge-fix-core' -> 'packages/forge-fix-core'
                                alternativePath = path.join(this.rootPath, 'packages', mentionedPath);
                            }

                            if (!fs.existsSync(alternativePath)) {
                                drifts.push({
                                    taskId: 'Unknown', // Ideally parse ID
                                    description: line.trim(),
                                    expectedPath: mentionedPath,
                                    status: 'MISSING',
                                    details: `Documented as [x] but file/dir not found: ${mentionedPath}`
                                });
                                continue;
                            }
                        } else {
                            // Check for Stubs (naive)
                            if (fs.statSync(fullPath).isFile()) {
                                const fileContent = fs.readFileSync(fullPath, 'utf-8');
                                if (fileContent.includes('// TODO') || fileContent.length < 50) {
                                    drifts.push({
                                        taskId: 'Unknown',
                                        description: line.trim(),
                                        expectedPath: mentionedPath,
                                        status: 'STUB',
                                        details: `File exists but appears to be a stub.`
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        const missingItems = drifts.filter(d => d.status === 'MISSING').length;
        const stubItems = drifts.filter(d => d.status === 'STUB').length;
        const score = Math.max(0, 100 - ((missingItems * 10) + (stubItems * 5))); // Penalty logic

        return {
            score,
            totalItems,
            missingItems,
            stubItems,
            drifts
        };
    }
}

// CLI Execution Block
if (require.main === module) {
    const root = path.resolve(__dirname, '../../../');
    // Using absolute path from Agent Context
    const taskMd = 'C:/Users/brand/.gemini/antigravity/brain/7d40e210-cb46-41a5-8330-e8b7f383ac20/task.md';

    console.log(`👁️ [DOXEL] Running Standalone Scan...`);
    console.log(`   Target: ${taskMd}`);

    const checker = new RealityCheck(root);
    checker.scan(taskMd).then(result => {
        console.log(`=========================================`);
        console.log(` reality_score: ${result.score}%`);
        console.log(` total_tasks:   ${result.totalItems}`);
        console.log(` missing_files: ${result.missingItems}`);
        console.log(` stub_files:    ${result.stubItems}`);
        console.log(`=========================================`);

        if (result.missingItems > 0) {
            console.log(`\n❌ MISSING FILES (DRIFT DETECTED):`);
            result.drifts.filter(d => d.status === 'MISSING').forEach(d => {
                console.log(`   - ${d.expectedPath}`);
            });
        }

        if (result.stubItems > 0) {
            console.log(`\n⚠️ STUBBED FILES (FUTURE DEBT):`);
            result.drifts.filter(d => d.status === 'STUB').forEach(d => {
                console.log(`   - ${d.expectedPath}`);
            });
        }
    }).catch(err => {
        console.error('❌ Failed:', err);
    });
}
