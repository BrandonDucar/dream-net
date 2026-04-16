/**
 * @dreamnet/utils — Shared Utility Functions
 * 
 * Common utilities used across all DreamNet organs.
 */

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function timestamp(): number { return Date.now(); }

export function uuid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function truncate(str: string, maxLen = 100): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

export function retry<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await fn();
        return resolve(result);
      } catch (err) {
        if (i === maxRetries) return reject(err);
        await sleep(delayMs * Math.pow(2, i));
      }
    }
  });
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let timer: any;
  return ((...args: any[]) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }) as T;
}

export function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default { sleep, timestamp, uuid, truncate, retry, chunk, debounce, deepClone, formatBytes };
