import type { DiffResult } from './types.js';
import { readFileSync, existsSync } from "node:fs";

// Simple diff implementation (Phase 1)
// Phase 2: Use a proper diff library like `diff` or `diff-match-patch`
export function computeDiff(filePath: string, oldContent: string, newContent: string): DiffResult {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  let additions = 0;
  let deletions = 0;
  let changes = 0;

  // Simple line-by-line comparison
  const maxLen = Math.max(oldLines.length, newLines.length);
  const diffLines: string[] = [];

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined) {
      // Added line
      diffLines.push(`+ ${newLine}`);
      additions++;
      changes++;
    } else if (newLine === undefined) {
      // Deleted line
      diffLines.push(`- ${oldLine}`);
      deletions++;
      changes++;
    } else if (oldLine !== newLine) {
      // Modified line
      diffLines.push(`- ${oldLine}`);
      diffLines.push(`+ ${newLine}`);
      additions++;
      deletions++;
      changes++;
    } else {
      // Unchanged line
      diffLines.push(`  ${oldLine}`);
    }
  }

  const diff = diffLines.join("\n");

  return {
    filePath,
    oldContent,
    newContent,
    diff,
    additions,
    deletions,
    changes,
  };
}

export async function computeFileDiff(filePath: string, newContent: string): Promise<DiffResult | null> {
  if (!existsSync(filePath)) {
    // New file
    return {
      filePath,
      oldContent: "",
      newContent,
      diff: newContent.split("\n").map((line) => `+ ${line}`).join("\n"),
      additions: newContent.split("\n").length,
      deletions: 0,
      changes: newContent.split("\n").length,
    };
  }

  const oldContent = readFileSync(filePath, "utf-8");
  return computeDiff(filePath, oldContent, newContent);
}

