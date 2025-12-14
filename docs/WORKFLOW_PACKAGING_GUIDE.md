# Workflow Packaging Guide

**Status**: 📋 Packaging Guide  
**Priority**: 🔴 HIGH  
**Last Updated**: 2025-01-27

---

## Overview

This guide explains how to **package workflows** for reuse, distribution, and execution across DreamNet. Workflows can be packaged as standalone modules or integrated into larger operations.

---

## Workflow Package Structure

### Standard Package Format

```
workflows/
├── publishpack/
│   ├── index.ts                 # Main workflow exports
│   ├── arxiv-pack.ts           # ArxivPack workflow
│   ├── zora-pack.ts            # ZoraPack workflow
│   ├── github-pack.ts          # GitHubPack workflow
│   ├── website-pack.ts         # WebsitePack workflow
│   ├── medium-pack.ts          # MediumPack workflow
│   ├── social-pack.ts          # SocialLaunchPack workflow
│   ├── manifest-generator.ts   # Manifest generation workflow
│   ├── registry-manager.ts     # Registry management workflow
│   └── types.ts                # Workflow types
├── shared/
│   ├── source-loader.ts        # Shared source loading
│   ├── converter.ts            # Format converters
│   └── validator.ts            # Validation utilities
└── README.md                   # Workflow documentation
```

---

## Packaging Patterns

### Pattern 1: Standalone Workflow Package

**Purpose**: Package a single workflow for independent execution

**Structure**:
```typescript
// workflows/publishpack/arxiv-pack.ts
export interface ArxivPackWorkflow {
  name: "arxiv-pack";
  version: "1.0.0";
  execute: (input: ArxivPackInput) => Promise<ArxivPackOutput>;
  validate: (input: ArxivPackInput) => ValidationResult;
  dependencies: string[]; // Other workflows this depends on
}

export const arxivPackWorkflow: ArxivPackWorkflow = {
  name: "arxiv-pack",
  version: "1.0.0",
  execute: async (input) => {
    // Workflow execution logic
  },
  validate: (input) => {
    // Validation logic
  },
  dependencies: ["source-loader"]
};
```

### Pattern 2: Composite Workflow Package

**Purpose**: Package multiple related workflows together

**Structure**:
```typescript
// workflows/publishpack/index.ts
export * from "./arxiv-pack";
export * from "./zora-pack";
export * from "./github-pack";

export interface PublishPackWorkflowSuite {
  workflows: Workflow[];
  executeAll: (input: PublishPackInput) => Promise<PublishPackOutput>;
  executeSelective: (input: PublishPackInput, platforms: Platform[]) => Promise<PublishPackOutput>;
}

export const publishPackWorkflowSuite: PublishPackWorkflowSuite = {
  workflows: [
    arxivPackWorkflow,
    zoraPackWorkflow,
    githubPackWorkflow,
    websitePackWorkflow,
    mediumPackWorkflow,
    socialPackWorkflow
  ],
  executeAll: async (input) => {
    // Execute all workflows
  },
  executeSelective: async (input, platforms) => {
    // Execute selected workflows
  }
};
```

### Pattern 3: Workflow with Sub-Workflows

**Purpose**: Package a workflow with nested sub-workflows

**Structure**:
```typescript
// workflows/publishpack/manifest-generator.ts
export interface ManifestGeneratorWorkflow {
  name: "manifest-generator";
  subWorkflows: {
    aggregate: AggregatePackagesWorkflow;
    validate: ValidateManifestWorkflow;
    register: RegisterArtifactWorkflow;
  };
  execute: (input: ManifestGeneratorInput) => Promise<ManifestGeneratorOutput>;
}

export const manifestGeneratorWorkflow: ManifestGeneratorWorkflow = {
  name: "manifest-generator",
  subWorkflows: {
    aggregate: aggregatePackagesWorkflow,
    validate: validateManifestWorkflow,
    register: registerArtifactWorkflow
  },
  execute: async (input) => {
    // Execute sub-workflows in sequence
    const aggregated = await this.subWorkflows.aggregate.execute(input);
    const validated = await this.subWorkflows.validate.execute(aggregated);
    const registered = await this.subWorkflows.register.execute(validated);
    return registered;
  }
};
```

---

## Workflow Metadata

### Workflow Manifest

```typescript
interface WorkflowManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  inputs: InputSchema;
  outputs: OutputSchema;
  dependencies: string[];
  executionTime: {
    estimated: number; // milliseconds
    max: number;
  };
  errorHandling: {
    retryable: boolean;
    maxRetries: number;
    fallback?: string;
  };
  security: {
    requiresAuth: boolean;
    allowedPaths: string[];
    networkAccess: boolean;
  };
}
```

### Example Manifest

```json
{
  "name": "arxiv-pack",
  "version": "1.0.0",
  "description": "Generate arXiv submission package",
  "author": "DreamNet",
  "inputs": {
    "source": {
      "type": "NormalizedSource",
      "required": true
    },
    "artifact": {
      "type": "ArtifactDescription",
      "required": true
    }
  },
  "outputs": {
    "package": {
      "type": "ArxivPackage"
    }
  },
  "dependencies": ["source-loader", "latex-compiler"],
  "executionTime": {
    "estimated": 5000,
    "max": 30000
  },
  "errorHandling": {
    "retryable": true,
    "maxRetries": 3,
    "fallback": "manual-generation"
  },
  "security": {
    "requiresAuth": false,
    "allowedPaths": ["build/"],
    "networkAccess": false
  }
}
```

---

## Workflow Execution Engine

### Workflow Executor

```typescript
class WorkflowExecutor {
  async execute(
    workflow: Workflow,
    input: any,
    context: ExecutionContext
  ): Promise<WorkflowResult> {
    // 1. Validate input
    const validation = await workflow.validate(input);
    if (!validation.valid) {
      return { success: false, error: validation.errors };
    }
    
    // 2. Check dependencies
    await this.checkDependencies(workflow.dependencies);
    
    // 3. Execute in sandbox (if configured)
    if (workflow.security.requiresSandbox) {
      return await this.executeInSandbox(workflow, input, context);
    }
    
    // 4. Execute workflow
    try {
      const output = await workflow.execute(input, context);
      return { success: true, output };
    } catch (error) {
      // Handle error based on workflow error handling config
      return await this.handleError(error, workflow, input);
    }
  }
  
  async executeInSandbox(
    workflow: Workflow,
    input: any,
    context: ExecutionContext
  ): Promise<WorkflowResult> {
    return await Sandbox.execute(
      () => workflow.execute(input, context),
      {
        allowedPaths: workflow.security.allowedPaths,
        networkAccess: workflow.security.networkAccess
      }
    );
  }
}
```

---

## Workflow Registry

### Registering Workflows

```typescript
class WorkflowRegistry {
  private workflows: Map<string, Workflow> = new Map();
  
  register(workflow: Workflow): void {
    // Validate workflow
    this.validateWorkflow(workflow);
    
    // Check for conflicts
    if (this.workflows.has(workflow.name)) {
      throw new Error(`Workflow ${workflow.name} already registered`);
    }
    
    // Register workflow
    this.workflows.set(workflow.name, workflow);
    
    // Publish registration event
    NervousSystem.publish({
      topic: "workflow.registered",
      payload: { workflow: workflow.name, version: workflow.version }
    });
  }
  
  get(name: string): Workflow | undefined {
    return this.workflows.get(name);
  }
  
  list(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}
```

---

## Workflow Composition

### Composing Workflows

```typescript
class WorkflowComposer {
  async compose(
    workflows: Workflow[],
    executionOrder: "sequential" | "parallel" | "conditional"
  ): Promise<CompositeWorkflow> {
    return {
      workflows,
      execute: async (input) => {
        switch (executionOrder) {
          case "sequential":
            return await this.executeSequentially(workflows, input);
          case "parallel":
            return await this.executeInParallel(workflows, input);
          case "conditional":
            return await this.executeConditionally(workflows, input);
        }
      }
    };
  }
  
  async executeSequentially(
    workflows: Workflow[],
    input: any
  ): Promise<any> {
    let currentInput = input;
    for (const workflow of workflows) {
      const result = await workflow.execute(currentInput);
      currentInput = result.output || currentInput;
    }
    return currentInput;
  }
  
  async executeInParallel(
    workflows: Workflow[],
    input: any
  ): Promise<any> {
    const results = await Promise.allSettled(
      workflows.map(w => w.execute(input))
    );
    return this.aggregateResults(results);
  }
}
```

---

## Workflow Versioning

### Version Management

```typescript
interface WorkflowVersion {
  workflow: string;
  version: string;
  deprecated: boolean;
  migration?: MigrationPath;
}

class WorkflowVersionManager {
  async migrate(
    workflowName: string,
    fromVersion: string,
    toVersion: string,
    input: any
  ): Promise<any> {
    const workflow = await this.getWorkflow(workflowName, toVersion);
    const migration = await this.getMigration(workflowName, fromVersion, toVersion);
    
    if (migration) {
      // Transform input using migration
      const migratedInput = await migration.transform(input);
      return await workflow.execute(migratedInput);
    } else {
      // Direct execution
      return await workflow.execute(input);
    }
  }
}
```

---

## Workflow Testing

### Workflow Test Framework

```typescript
class WorkflowTester {
  async testWorkflow(
    workflow: Workflow,
    testCases: TestCase[]
  ): Promise<TestResults> {
    const results: TestResult[] = [];
    
    for (const testCase of testCases) {
      try {
        const result = await workflow.execute(testCase.input);
        results.push({
          testCase: testCase.name,
          success: this.compareOutput(result, testCase.expectedOutput),
          actual: result,
          expected: testCase.expectedOutput
        });
      } catch (error) {
        results.push({
          testCase: testCase.name,
          success: false,
          error: error.message
        });
      }
    }
    
    return { results, passed: results.filter(r => r.success).length };
  }
}
```

---

## Workflow Documentation

### Auto-Generated Documentation

```typescript
class WorkflowDocumentationGenerator {
  generateDocs(workflow: Workflow): WorkflowDocumentation {
    return {
      name: workflow.name,
      version: workflow.version,
      description: workflow.description,
      inputs: this.documentInputs(workflow.inputs),
      outputs: this.documentOutputs(workflow.outputs),
      steps: this.documentSteps(workflow),
      examples: this.generateExamples(workflow),
      errorHandling: this.documentErrorHandling(workflow),
      security: this.documentSecurity(workflow)
    };
  }
}
```

---

## Implementation Plan

### Phase 1: Workflow Infrastructure

1. Create workflow package structure
2. Implement workflow executor
3. Implement workflow registry
4. Create workflow types

### Phase 2: PublishPack Workflows

1. Package ArxivPack workflow
2. Package ZoraPack workflow
3. Package GitHubPack workflow
4. Package WebsitePack workflow
5. Package MediumPack workflow
6. Package SocialLaunchPack workflow

### Phase 3: Workflow Composition

1. Implement workflow composer
2. Create composite workflows
3. Implement conditional execution
4. Add workflow versioning

### Phase 4: Testing & Documentation

1. Create workflow test framework
2. Generate workflow documentation
3. Create workflow examples
4. Document best practices

---

**Status**: 📋 Complete Packaging Guide

