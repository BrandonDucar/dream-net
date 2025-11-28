#!/usr/bin/env tsx
/**
 * BuildLogSummarizer - Analyze build logs and identify TOP 3 failure lines with fixes
 * 
 * Task: Given one or more build logs (paste or file paths), identify the TOP 3 failure lines
 * and propose concrete fixes.
 */

import { readFileSync, existsSync } from 'fs';

interface Failure {
  line: string;
  category: string;
  cause: string;
  fix: string[];
}

class BuildLogSummarizer {
  private failures: Failure[] = [];
  
  parseLog(logPath: string): void {
    if (!existsSync(logPath)) {
      console.error(`❌ Log file not found: ${logPath}`);
      return;
    }
    
    const content = readFileSync(logPath, 'utf-8');
    const lines = content.split('\n');
    
    // Classify failures
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Missing env vars
      if (line.match(/Missing.*environment|env.*not.*set|undefined.*env/i)) {
        this.failures.push({
          line,
          category: 'missing_env',
          cause: 'Required environment variable not set',
          fix: [
            'Add missing env var to .env file or CI secrets',
            'Check vercel.json or cloud config for env var setup',
            'Verify env var name matches code expectations'
          ]
        });
      }
      
      // Wrong working directory
      if (line.match(/cannot find.*module|ENOENT|working.*directory/i)) {
        this.failures.push({
          line,
          category: 'wrong_directory',
          cause: 'Build running from wrong directory or missing files',
          fix: [
            'Check rootDirectory in vercel.json matches actual structure',
            'Verify build command uses correct paths (cd client && ...)',
            'Ensure source files exist in expected locations'
          ]
        });
      }
      
      // Version mismatch
      if (line.match(/version.*mismatch|unsupported.*version|ERR_PNPM/i)) {
        this.failures.push({
          line,
          category: 'version_mismatch',
          cause: 'Node/pnpm version mismatch between local and CI',
          fix: [
            'Update package.json engines to match CI environment',
            'Use .nvmrc or .node-version to pin Node version',
            'Check vercel.json installCommand for pnpm version'
          ]
        });
      }
      
      // TypeScript/ESLint errors
      if (line.match(/TS\d+|error TS|ESLint.*error/i)) {
        this.failures.push({
          line,
          category: 'compilation_error',
          cause: 'TypeScript or linting error in source code',
          fix: [
            'Run pnpm run typecheck locally to reproduce',
            'Fix TypeScript errors shown in log',
            'Check tsconfig.json paths and includes'
          ]
        });
      }
      
      // Missing migrations
      if (line.match(/migration|schema|prisma|drizzle.*push/i)) {
        this.failures.push({
          line,
          category: 'missing_migration',
          cause: 'Database schema not up to date',
          fix: [
            'Run pnpm run db:push locally',
            'Add migration step to build process if needed',
            'Verify database connection string is correct'
          ]
        });
      }
    }
  }
  
  getTop3Failures(): Failure[] {
    // Deduplicate by category, keep first occurrence
    const seen = new Set<string>();
    const unique: Failure[] = [];
    
    for (const failure of this.failures) {
      if (!seen.has(failure.category)) {
        seen.add(failure.category);
        unique.push(failure);
      }
    }
    
    return unique.slice(0, 3);
  }
  
  summarize(logPath: string): void {
    console.log('🔍 BuildLogSummarizer - Analyzing build logs...\n');
    
    this.parseLog(logPath);
    const top3 = this.getTop3Failures();
    
    if (top3.length === 0) {
      console.log('✅ No failures detected in log');
      return;
    }
    
    console.log('=== TOP 3 Failures ===\n');
    
    top3.forEach((failure, index) => {
      console.log(`${index + 1}) 🔴 Failure: ${failure.category}`);
      console.log(`   • Log: "${failure.line.substring(0, 100)}${failure.line.length > 100 ? '...' : ''}"`);
      console.log(`   • Why: ${failure.cause}`);
      console.log(`   • Fix:`);
      failure.fix.forEach(step => console.log(`      - ${step}`));
      console.log('');
    });
    
    console.log('=== Smoke Test ===');
    console.log('✅ Smoke Test (local): pnpm run typecheck && cd client && pnpm run build');
    console.log('✅ Smoke Test (CI): Check build logs for same errors after fixes');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const logPath = process.argv[2];
  if (!logPath) {
    console.error('Usage: tsx scripts/build-log-summarizer.ts <log-file>');
    process.exit(1);
  }
  
  const summarizer = new BuildLogSummarizer();
  summarizer.summarize(logPath);
}

export { BuildLogSummarizer };

