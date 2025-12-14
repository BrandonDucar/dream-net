/**
 * CultureGuardian Agent Types
 * Protects and moderates culturecoin content and communities
 */

export interface CultureGuardianTask {
  moderate: {
    content: string;
    type?: "text" | "image" | "video";
  };
  protect: {
    community: string;
    rules: string[];
  };
}

export interface CultureGuardianOutput {
  moderate: {
    safe: boolean;
    flags: string[];
    reason?: string;
  };
  protect: {
    status: string;
    violations: Array<{
      rule: string;
      count: number;
    }>;
  };
}


