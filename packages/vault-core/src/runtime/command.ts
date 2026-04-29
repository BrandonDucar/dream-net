import { execFile } from "node:child_process";

export interface CommandResult {
  command: string;
  args: string[];
  exitCode: number | null;
  stdout: string;
  stderr: string;
  error?: string;
}

export function runCommand(command: string, args: string[], timeoutMs = 20_000): Promise<CommandResult> {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      {
        timeout: timeoutMs,
        windowsHide: true,
        shell: process.platform === "win32",
        maxBuffer: 8 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        const maybeError = error as NodeJS.ErrnoException | null;
        resolve({
          command,
          args,
          exitCode: typeof maybeError?.code === "number" ? maybeError.code : maybeError ? 1 : 0,
          stdout: String(stdout ?? ""),
          stderr: String(stderr ?? ""),
          error: maybeError?.message,
        });
      },
    );
  });
}

export async function commandExists(command: string): Promise<{ exists: boolean; path?: string; error?: string }> {
  const lookup = process.platform === "win32" ? "where.exe" : "which";
  const result = await runCommand(lookup, [command], 8_000);
  if (result.exitCode === 0) {
    return { exists: true, path: result.stdout.trim().split(/\r?\n/)[0] };
  }
  return { exists: false, error: result.stderr.trim() || result.error };
}
