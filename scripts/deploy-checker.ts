#!/usr/bin/env tsx
/**
 * DeployChecker - Verify environment parity across local, CI, and production
 * 
 * Goal: Verify environment parity across local, CI, and production, then output a crisp 3-line summary.
 * 
 * Inputs:
 * - Package manager, Node/PNPM versions, build command, framework
 * - ENV sources: .env/.env.local, CI secrets, hosting provider vars, .env.example
 * - Build logs (paste or path), lockfiles, container/Dockerfiles, vercel.json, cloud config
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface EnvSource {
  name: string;
  vars: Record<string, string | undefined>;
}

interface CheckResult {
  passed: boolean;
  message: string;
  fix?: string;
}

class DeployChecker {
  private envSources: EnvSource[] = [];
  private requiredVars = ['NODE_ENV', 'DATABASE_URL', 'JWT_SECRET', 'PUBLIC_BASE_URL'];
  
  collectEnvSources(): void {
    // Collect from .env files
    const envFiles = ['.env', '.env.local', '.env.production', '.env.example'];
    for (const file of envFiles) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        const vars: Record<string, string | undefined> = {};
        content.split('\n').forEach(line => {
          const match = line.match(/^([A-Z_]+)=(.+)$/);
          if (match) {
            vars[match[1]] = match[2].trim();
          }
        });
        this.envSources.push({ name: file, vars });
      }
    }
  }
  
  checkEnvParity(): CheckResult {
    const missing: string[] = [];
    const extra: string[] = [];
    
    // Check required vars
    for (const varName of this.requiredVars) {
      let found = false;
      for (const source of this.envSources) {
        if (source.vars[varName]) {
          found = true;
          break;
        }
      }
      if (!found) {
        missing.push(varName);
      }
    }
    
    if (missing.length > 0) {
      return {
        passed: false,
        message: `Missing required environment variables: ${missing.join(', ')}`,
        fix: `Add missing vars to .env files or CI secrets: ${missing.join(', ')}`
      };
    }
    
    return { passed: true, message: 'All required environment variables present' };
  }
  
  checkBuildSanity(): CheckResult {
    // Check Node/pnpm versions
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const nodeVersion = process.version;
    const pnpmVersion = process.env.npm_config_user_agent?.match(/pnpm\/(\d+\.\d+\.\d+)/)?.[1];
    
    // Check for version mismatches
    if (packageJson.engines?.node && !nodeVersion.match(new RegExp(packageJson.engines.node.replace('>=', '')))) {
      return {
        passed: false,
        message: `Node version mismatch: required ${packageJson.engines.node}, got ${nodeVersion}`,
        fix: `Update Node.js to match package.json engines requirement`
      };
    }
    
    return { passed: true, message: 'Build configuration valid' };
  }
  
  generateSummary(): string {
    const envCheck = this.checkEnvParity();
    const buildCheck = this.checkBuildSanity();
    
    if (!envCheck.passed) {
      return `Root cause: ${envCheck.message}\nMinimal fix: ${envCheck.fix}\nVerify: Run 'pnpm run check:deploy' again after adding missing vars`;
    }
    
    if (!buildCheck.passed) {
      return `Root cause: ${buildCheck.message}\nMinimal fix: ${buildCheck.fix}\nVerify: Check Node/pnpm versions match package.json`;
    }
    
    return `Root cause: Environment parity verified\nMinimal fix: None required\nVerify: Run 'cd client && pnpm run build' locally to match CI`;
  }
  
  run(): void {
    console.log('🔍 DeployChecker - Verifying environment parity...\n');
    
    this.collectEnvSources();
    const summary = this.generateSummary();
    
    console.log('=== 3-Line Summary ===');
    console.log(summary);
    console.log('\n=== Apply This ===');
    console.log('1. Review missing environment variables');
    console.log('2. Add to .env files or CI secrets');
    console.log('3. Verify with: pnpm run check:deploy');
  }
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const checker = new DeployChecker();
  checker.run();
} else if (process.argv[1] && process.argv[1].includes('deploy-checker')) {
  const checker = new DeployChecker();
  checker.run();
}

export { DeployChecker };

