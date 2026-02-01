/**
 * BUILD IMPACT GRAPH
 * "Second-order effects visibility"
 */
export class ImpactGraph {
    // Map of FileType -> [Downstream Dependencies]
    private dependencyMap: Record<string, string[]> = {
        'package.json': ['node_modules', 'build_pipeline', 'server_boot'],
        'tsconfig.json': ['compilation', 'editor_intellisense'],
        '.env': ['runtime_config', 'database_connection', 'api_keys'],
        'index.ts': ['boot_sequence', 'route_registration']
    };

    /**
     * Calculates Blast Radius of a change.
     */
    predictBlastRadius(filename: string): string[] {
        const basename = filename.split(/[/\\]/).pop() || '';
        // Exact match or extension match
        if (this.dependencyMap[basename]) {
            return this.dependencyMap[basename];
        }

        // Heuristic: Logic changes break tests
        if (basename.endsWith('.ts')) return ['unit_tests', 'runtime_stability'];

        return ['unknown_impact'];
    }
}
