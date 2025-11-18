# Dark Fabric

Dark Fabric is DreamNet's safe code generation, mutation, and testing system. It provides a sandboxed environment for code generation, diff computation, and validation before deployment.

## Overview

- **Package**: `@dreamnet/dark-fabric`
- **Location**: `packages/dark-fabric/`
- **Purpose**: Safe code generation, mutation, testing, and validation

## Core Concepts

### Fabric Tasks

Fabric tasks are code generation or mutation requests. Each task has:
- **Type**: generate, mutate, refactor, test, merge, custom
- **Status**: pending, running, completed, failed, approved, rejected
- **Target**: File path, module path, endpoint path, or agent ID
- **Instruction**: What to generate or mutate
- **Generated**: Generated code, diff, files
- **Sandbox**: Sandbox execution results
- **Validation**: Validation results (issues, warnings)
- **Approval**: Approval/rejection info

### Sandbox

The sandbox provides isolated code execution:
- **Phase 1**: Syntax validation (basic checks)
- **Phase 2**: Full VM isolation (future)
- **Test Results**: Test execution results
- **Execution Time**: Time taken to execute

### Diff Engine

The diff engine computes differences between old and new code:
- **File Diff**: Differences between old and new file content
- **Additions**: Number of lines added
- **Deletions**: Number of lines deleted
- **Changes**: Total number of changes

### Validators

Validators check code safety:
- **Task Validation**: Validate task requirements
- **Code Safety**: Check for dangerous patterns
- **Syntax Validation**: Basic syntax checks

## API Endpoints

### Tasks

- `GET /api/fabric/tasks` - List all tasks (optionally filter by type, status)
- `GET /api/fabric/tasks/:id` - Get task by ID
- `POST /api/fabric/tasks` - Create a new task
- `PUT /api/fabric/tasks/:id` - Update a task

### Execution

- `POST /api/fabric/tasks/:id/run` - Run a task in the sandbox
- `POST /api/fabric/tasks/:id/approve` - Approve a task
- `POST /api/fabric/tasks/:id/reject` - Reject a task

## Integration

### Squad Builder

Dark Fabric can create tasks in Squad Builder:
- Tasks can be created for code generation
- Tasks require approval before execution
- Execution results are tracked

### Event Wormholes

Dark Fabric can emit events for:
- Task completion
- Task failure
- Validation issues

## Usage Example

```typescript
import { createFabricTask, runFabricTask, approveFabricTask } from "@dreamnet/dark-fabric";

// Create a task
const task = createFabricTask({
  type: "generate",
  target: {
    filePath: "src/utils/helper.ts",
  },
  instruction: "Generate a helper function for string manipulation",
  status: "pending",
});

// Run the task
const result = await runFabricTask(task.id);

// Approve the task
if (result.validation?.passed) {
  approveFabricTask(task.id, "operator", "Code looks good");
}
```

## Task Types

### Generate
- Generate new code
- Target: file path or module path
- Instruction: What to generate

### Mutate
- Mutate existing code
- Target: file path
- Instruction: How to mutate

### Refactor
- Refactor existing code
- Target: file path or module path
- Instruction: How to refactor

### Test
- Generate or run tests
- Target: file path
- Instruction: What to test

### Merge
- Merge code changes
- Target: file path
- Instruction: How to merge

### Custom
- Custom task types
- Target: varies
- Instruction: varies

## Status Flow

```
pending → running → completed/failed → approved/rejected
```

## Validation

### Task Validation
- Task type is required
- Target is required
- Instruction is required
- Generated code size limits

### Code Safety
- Check for dangerous patterns (eval, Function, process.exit)
- Check for dangerous imports (fs, child_process)
- Check for file system operations
- Check for network operations

### Syntax Validation
- Basic syntax checks (braces, parentheses)
- Phase 1: Simple checks
- Phase 2: Full TypeScript compilation

## Safety Guarantees

- Tasks require approval before deployment
- Code is validated before execution
- Dangerous patterns are detected and warned
- Sandbox execution is isolated
- Diffs are computed and reviewable

## Phase 1 vs Phase 2

### Phase 1 (Current)
- Syntax validation (basic checks)
- Code safety validation
- Diff computation
- Task approval workflow

### Phase 2 (Future)
- Full VM isolation
- TypeScript compilation
- Full test execution
- Code generation via LLM
- Automatic code application

## Approval Workflow

1. **Create Task**: Task is created with status `pending`
2. **Run Task**: Task is run in sandbox, status becomes `running`
3. **Validate**: Code is validated, status becomes `completed` or `failed`
4. **Review**: Operator reviews the diff and validation results
5. **Approve/Reject**: Operator approves or rejects the task
6. **Deploy**: Approved tasks can be deployed (Phase 2)

