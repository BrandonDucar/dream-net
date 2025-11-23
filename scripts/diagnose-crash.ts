#!/usr/bin/env tsx
/**
 * DreamNet Crash Diagnostic Tool
 * 
 * Collects crash context and prepares it for AI analysis
 * Can be used with SurgeonAgent or OpenAI directly
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIAGNOSTIC_REPORT_PATH = join(process.cwd(), 'CRASH_DIAGNOSTIC_REPORT.md');

interface CrashContext {
  timestamp: string;
  podName?: string;
  podStatus: string;
  podLogs: string;
  podEvents: string;
  podDescription: string;
  deploymentConfig: string;
  serverStartupCode: string;
  errorPatterns: string[];
  environment: Record<string, string>;
}

async function collectCrashContext(): Promise<CrashContext> {
  console.log('🔍 Collecting crash diagnostic data...\n');

  // Get pod name
  let podName: string;
  try {
    podName = execSync('kubectl get pods -l app=dreamnet-api -o jsonpath="{.items[0].metadata.name}"', { encoding: 'utf-8' }).trim();
  } catch {
    // Try alternative selector
    podName = execSync('kubectl get pods | Select-String "dreamnet-api" | Select-Object -First 1', { encoding: 'utf-8' }).trim().split(/\s+/)[0];
  }
  
  if (!podName) {
    throw new Error('No dreamnet-api pods found. Make sure you are connected to the cluster.');
  }

  console.log(`📦 Found pod: ${podName}\n`);

  // Collect all diagnostic data
  const context: CrashContext = {
    timestamp: new Date().toISOString(),
    podName,
    podStatus: execSync(`kubectl get pod ${podName} -o yaml`, { encoding: 'utf-8' }),
    podLogs: execSync(`kubectl logs ${podName} --tail=200`, { encoding: 'utf-8' }),
    podEvents: execSync(`kubectl get events --field-selector involvedObject.name=${podName} --sort-by='.lastTimestamp'`, { encoding: 'utf-8' }),
    podDescription: execSync(`kubectl describe pod ${podName}`, { encoding: 'utf-8' }),
    deploymentConfig: readFileSync(join(process.cwd(), 'infrastructure/google/gke/deployment.yaml'), 'utf-8'),
    serverStartupCode: readFileSync(join(process.cwd(), 'server/index.ts'), 'utf-8').split('\n').slice(1609, 1733).join('\n'),
    errorPatterns: [],
    environment: {}
  };

  // Extract error patterns from logs
  const errorLines = context.podLogs.split('\n').filter(line => 
    line.includes('Error') || 
    line.includes('ERROR') || 
    line.includes('Failed') || 
    line.includes('Crash') ||
    line.includes('exit') ||
    line.includes('ELIFECYCLE')
  );
  context.errorPatterns = errorLines;

  // Extract environment from deployment
  const envMatch = context.deploymentConfig.match(/env:\s*\n((?:\s+-.*\n?)+)/);
  if (envMatch) {
    const envLines = envMatch[1].split('\n').filter(l => l.includes('name:') || l.includes('value:'));
    // Parse env vars (simplified)
    for (let i = 0; i < envLines.length; i += 2) {
      const nameMatch = envLines[i]?.match(/name:\s*(.+)/);
      const valueMatch = envLines[i + 1]?.match(/value:\s*(.+)/);
      if (nameMatch && valueMatch) {
        context.environment[nameMatch[1].trim()] = valueMatch[1].trim();
      }
    }
  }

  return context;
}

function generateDiagnosticReport(context: CrashContext): string {
  return `# DreamNet Crash Diagnostic Report

**Generated:** ${context.timestamp}
**Pod:** ${context.podName || 'unknown'}

## 🔴 Problem Summary

Server is crashing during startup in GKE. Pods enter CrashLoopBackOff state.

## 📊 Pod Status

\`\`\`
${context.podStatus.split('\n').slice(0, 50).join('\n')}
\`\`\`

## 📝 Recent Logs (Last 200 lines)

\`\`\`
${context.podLogs}
\`\`\`

## ⚠️ Error Patterns Detected

${context.errorPatterns.map(e => `- ${e}`).join('\n')}

## 📅 Pod Events

\`\`\`
${context.podEvents}
\`\`\`

## 🔧 Pod Description

\`\`\`
${context.podDescription.split('\n').slice(0, 100).join('\n')}
\`\`\`

## ⚙️ Deployment Configuration

\`\`\`yaml
${context.deploymentConfig}
\`\`\`

## 💻 Server Startup Code (Critical Section)

\`\`\`typescript
${context.serverStartupCode}
\`\`\`

## 🌍 Environment Variables

\`\`\`json
${JSON.stringify(context.environment, null, 2)}
\`\`\`

## 🤖 AI Surgeon Analysis Request

**Context for AI Analysis:**

The DreamNet server is deployed to GKE Autopilot and is crashing during startup. The server:
1. Successfully builds Docker image
2. Pods are scheduled and containers start
3. Server begins initialization (logs show subsystem loading)
4. Crashes before reaching "Serving on port" message
5. Pods enter CrashLoopBackOff and restart

**Key Observations:**
- Server initializes subsystems but crashes before \`server.listen()\` callback executes
- No "Serving on port" message in logs
- Error shows "ELIFECYCLE Command failed" 
- Readiness probe fails: connection refused on port 8080
- Liveness probe fails: connection refused

**Questions for AI Surgeon:**
1. What is causing the server to crash before listening on port 8080?
2. Is there a synchronous error in the startup code that's not being caught?
3. Are there missing dependencies or initialization issues?
4. Should we make the server listen immediately, then initialize subsystems?
5. What specific code changes would fix this?

**Recommended Fix:**
Please analyze the startup code and logs to identify the root cause and provide a fix.
`;
}

async function main() {
  try {
    console.log('🏥 DreamNet Crash Diagnostic Tool\n');
    
    const context = await collectCrashContext();
    const report = generateDiagnosticReport(context);
    
    writeFileSync(DIAGNOSTIC_REPORT_PATH, report);
    
    console.log('✅ Diagnostic report generated!');
    console.log(`📄 Report saved to: ${DIAGNOSTIC_REPORT_PATH}\n`);
    console.log('📋 Report Summary:');
    console.log(`   - Pod Status: Collected`);
    console.log(`   - Logs: ${context.podLogs.split('\n').length} lines`);
    console.log(`   - Errors Found: ${context.errorPatterns.length}`);
    console.log(`   - Environment Vars: ${Object.keys(context.environment).length}\n`);
    
    console.log('🤖 Next Steps:');
    console.log('   1. Review the diagnostic report');
    console.log('   2. Use AI Surgeon or OpenAI to analyze the report');
    console.log('   3. Apply recommended fixes\n');
    
    // Also output a summary for quick review
    console.log('🔍 Quick Error Summary:');
    context.errorPatterns.slice(0, 10).forEach((err, i) => {
      console.log(`   ${i + 1}. ${err.substring(0, 100)}`);
    });
    
  } catch (error: any) {
    console.error('❌ Diagnostic collection failed:', error.message);
    process.exit(1);
  }
}

main();

