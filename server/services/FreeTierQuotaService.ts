/**
 * Free Tier Quota Service
 * Tracks Google Cloud Free Tier usage to maximize free resources before using paid credits
 * 
 * Free Tier Limits (per billing account, monthly):
 * - Cloud Run: 2M requests, 360K GB-seconds memory, 180K vCPU-seconds compute, 1GB outbound
 * - Cloud Build: 2,500 build-minutes (e2-standard-2)
 * - BigQuery: 1TB querying, 10GB storage
 * - Cloud Storage: 5GB-months, 5K Class A ops, 50K Class B ops
 */

type QuotaType = 
  | 'cloudrun-requests'
  | 'cloudrun-gb-seconds'
  | 'cloudrun-vcpu-seconds'
  | 'cloudrun-outbound-gb'
  | 'cloudbuild-minutes'
  | 'bigquery-query-tb'
  | 'bigquery-storage-gb'
  | 'storage-gb-months'
  | 'storage-class-a-ops'
  | 'storage-class-b-ops';

interface QuotaRecord {
  quotaType: QuotaType;
  limit: number; // Free Tier limit
  used: number; // Current usage this month
  lastResetAt: string; // ISO timestamp of last reset
  lastUpdated: string; // ISO timestamp of last update
}

interface QuotaStatus {
  quotaType: QuotaType;
  limit: number;
  used: number;
  remaining: number;
  percentageUsed: number;
  status: 'ok' | 'warning' | 'critical' | 'exceeded';
  lastResetAt: string;
  lastUpdated: string;
}

const quotas = new Map<QuotaType, QuotaRecord>();

// Free Tier limits (per month)
const FREE_TIER_LIMITS: Record<QuotaType, number> = {
  'cloudrun-requests': 2_000_000,
  'cloudrun-gb-seconds': 360_000,
  'cloudrun-vcpu-seconds': 180_000,
  'cloudrun-outbound-gb': 1,
  'cloudbuild-minutes': 2_500,
  'bigquery-query-tb': 1,
  'bigquery-storage-gb': 10,
  'storage-gb-months': 5,
  'storage-class-a-ops': 5_000,
  'storage-class-b-ops': 50_000,
};

function getOrCreateQuota(quotaType: QuotaType): QuotaRecord {
  if (!quotas.has(quotaType)) {
    quotas.set(quotaType, {
      quotaType,
      limit: FREE_TIER_LIMITS[quotaType],
      used: 0,
      lastResetAt: getMonthStart().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
  }
  
  const quota = quotas.get(quotaType)!;
  
  // Reset if new month
  const monthStart = getMonthStart();
  const lastReset = new Date(quota.lastResetAt);
  if (lastReset < monthStart) {
    quota.used = 0;
    quota.lastResetAt = monthStart.toISOString();
    quota.lastUpdated = new Date().toISOString();
  }
  
  return quota;
}

function getMonthStart(): Date {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  monthStart.setUTCHours(0, 0, 0, 0);
  return monthStart;
}

function getQuotaStatus(quotaType: QuotaType): QuotaStatus {
  const record = getOrCreateQuota(quotaType);
  const remaining = Math.max(0, record.limit - record.used);
  const percentageUsed = (record.used / record.limit) * 100;
  
  let status: 'ok' | 'warning' | 'critical' | 'exceeded';
  if (percentageUsed >= 100) {
    status = 'exceeded';
  } else if (percentageUsed >= 95) {
    status = 'critical';
  } else if (percentageUsed >= 80) {
    status = 'warning';
  } else {
    status = 'ok';
  }
  
  return {
    quotaType,
    limit: record.limit,
    used: record.used,
    remaining,
    percentageUsed,
    status,
    lastResetAt: record.lastResetAt,
    lastUpdated: record.lastUpdated,
  };
}

export const FreeTierQuotaService = {
  /**
   * Get status for a specific quota
   */
  getQuotaStatus(quotaType: QuotaType): QuotaStatus {
    return getQuotaStatus(quotaType);
  },

  /**
   * Get all quota statuses
   */
  getAllQuotaStatuses(): QuotaStatus[] {
    return Object.keys(FREE_TIER_LIMITS).map((key) =>
      getQuotaStatus(key as QuotaType)
    );
  },

  /**
   * Check if quota has remaining capacity
   */
  checkQuota(quotaType: QuotaType, estimatedUsage: number): {
    allowed: boolean;
    status: QuotaStatus;
    reason?: string;
  } {
    const status = getQuotaStatus(quotaType);
    
    if (status.remaining < estimatedUsage) {
      return {
        allowed: false,
        status,
        reason: `Free Tier quota exceeded: ${quotaType} (${status.used}/${status.limit} used, need ${estimatedUsage})`,
      };
    }
    
    return {
      allowed: true,
      status,
    };
  },

  /**
   * Require quota (throws if insufficient)
   */
  requireQuota(quotaType: QuotaType, estimatedUsage: number): void {
    const check = FreeTierQuotaService.checkQuota(quotaType, estimatedUsage);
    if (!check.allowed) {
      throw new Error(check.reason || `Free Tier quota exceeded: ${quotaType}`);
    }
  },

  /**
   * Record quota usage
   */
  recordUsage(quotaType: QuotaType, usage: number): void {
    const record = getOrCreateQuota(quotaType);
    record.used += Math.max(0, usage);
    record.lastUpdated = new Date().toISOString();
  },

  /**
   * Reset quota (for testing or manual reset)
   */
  resetQuota(quotaType: QuotaType): void {
    const record = getOrCreateQuota(quotaType);
    record.used = 0;
    record.lastResetAt = getMonthStart().toISOString();
    record.lastUpdated = new Date().toISOString();
  },

  /**
   * Reset all quotas (monthly reset)
   */
  resetAllQuotas(): void {
    for (const quotaType of Object.keys(FREE_TIER_LIMITS) as QuotaType[]) {
      FreeTierQuotaService.resetQuota(quotaType);
    }
  },

  /**
   * Get critical quotas (exceeded or near limit)
   */
  getCriticalQuotas(): QuotaStatus[] {
    return FreeTierQuotaService.getAllQuotaStatuses().filter(
      (status) => status.status === 'critical' || status.status === 'exceeded'
    );
  },

  /**
   * Get warning quotas (80-95% used)
   */
  getWarningQuotas(): QuotaStatus[] {
    return FreeTierQuotaService.getAllQuotaStatuses().filter(
      (status) => status.status === 'warning'
    );
  },
};

