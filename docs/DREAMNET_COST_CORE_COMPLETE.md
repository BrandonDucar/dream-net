# DreamNet Cost Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Cost Core provides **API cost tracking and optimization** for DreamNet. It records costs, tracks spending, manages budgets, and triggers alerts when budgets are exceeded.

---

## Key Features

### Cost Tracking
- Record API costs
- Track costs by cluster
- Track costs by provider
- Track costs by operation
- Time-based cost aggregation

### Budget Management
- Set budgets per cluster
- Daily/weekly/monthly budgets
- Budget alerts
- Threshold-based alerts

### Cost Alerts
- Budget exceeded alerts
- Threshold alerts
- Alert acknowledgment
- Economic Engine integration

---

## Architecture

### Components

1. **Cost Store** (`store/costStore.ts`)
   - Cost record storage
   - Budget storage
   - Alert management
   - Summary calculation

2. **Cost Bridge** (`cost-economic-bridge`)
   - Economic Engine integration
   - Cost event bridging
   - Alert bridging

---

## API Reference

### Cost Recording

#### `recordCost(record: CostRecord): void`
Records a cost.

**Example**:
```typescript
DreamNetCostCore.recordCost({
  id: 'cost-123',
  clusterId: 'API_KEEPER',
  provider: 'openai',
  operation: 'chat-completion',
  cost: 0.002,
  currency: 'USD',
  timestamp: Date.now(),
  traceId: 'trace-456',
  metadata: {
    model: 'gpt-4',
    tokens: 1000,
  },
});
```

### Cost Summaries

#### `getCostSummary(clusterId: string): CostSummary`
Gets cost summary for a cluster.

**Example**:
```typescript
const summary = DreamNetCostCore.getCostSummary('API_KEEPER');
console.log(`Total: $${summary.totalCost}`);
console.log(`Today: $${summary.costToday}`);
console.log(`This Week: $${summary.costThisWeek}`);
console.log(`This Month: $${summary.costThisMonth}`);
```

#### `getAllCostSummaries(): Record<string, CostSummary>`
Gets cost summaries for all clusters.

### Budget Management

#### `setBudget(budget(budget: CostBudget): void`
Sets a budget.

**Example**:
```typescript
DreamNetCostCore.setBudget({
  id: 'budget-api-keeper',
  clusterId: 'API_KEEPER',
  amount: 1000,
  period: 'monthly',
  currency: 'USD',
  alertThreshold: 80, // Alert at 80% of budget
  enabled: true,
});
```

#### `getBudget(budgetId: string): CostBudget | undefined`
Gets budget by ID.

#### `getBudgetsForCluster(clusterId: string): CostBudget[]`
Gets budgets for a cluster.

### Alerts

#### `getActiveAlerts(): CostAlert[]`
Gets active cost alerts.

#### `acknowledgeAlert(alertId: string): void`
Acknowledges an alert.

---

## Data Models

### CostRecord

```typescript
interface CostRecord {
  id: string;
  clusterId: string;
  provider: string;
  operation: string;
  cost: number;
  currency: string;
  timestamp: number;
  traceId?: string;
  metadata?: Record<string, any>;
}
```

### CostSummary

```typescript
interface CostSummary {
  clusterId: string;
  totalCost: number;
  costToday: number;
  costThisWeek: number;
  costThisMonth: number;
  currency: string;
  recordCount: number;
  lastUpdatedAt: number;
}
```

### CostBudget

```typescript
interface CostBudget {
  id: string;
  clusterId: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly';
  currency: string;
  alertThreshold?: number; // Percentage (e.g., 80 = alert at 80%)
  enabled: boolean;
}
```

### CostAlert

```typescript
interface CostAlert {
  id: string;
  clusterId: string;
  threshold: number;
  currentCost: number;
  period: 'daily' | 'weekly' | 'monthly';
  triggeredAt: number;
  acknowledged: boolean;
}
```

---

## Cost Tracking

### Time Periods

- **Today**: Last 24 hours
- **This Week**: Last 7 days
- **This Month**: Last 30 days
- **Total**: All time

### Aggregation

- Costs aggregated by cluster
- Costs aggregated by provider
- Costs aggregated by operation
- Time-based aggregation

---

## Budget Management

### Budget Types

- **Daily**: Resets daily
- **Weekly**: Resets weekly
- **Monthly**: Resets monthly

### Alert Thresholds

- Percentage-based alerts
- Alert at threshold (e.g., 80%)
- Alert when exceeded
- Acknowledgment required

---

## Integration Points

### DreamNet Systems
- **Economic Engine**: Cost bridging
- **Alerts Core**: Alert notifications
- **Metrics Core**: Cost metrics
- **API Keeper**: API cost tracking

### External Systems
- **Billing Systems**: Cost export
- **Analytics**: Cost analysis
- **Reporting**: Cost reports

---

## Usage Examples

### Record Cost

```typescript
DreamNetCostCore.recordCost({
  id: `cost-${Date.now()}`,
  clusterId: 'API_KEEPER',
  provider: 'openai',
  operation: 'chat-completion',
  cost: 0.002,
  currency: 'USD',
  timestamp: Date.now(),
  traceId: 'trace-123',
  metadata: {
    model: 'gpt-4',
    tokens: 1000,
    promptTokens: 500,
    completionTokens: 500,
  },
});
```

### Set Budget

```typescript
DreamNetCostCore.setBudget({
  id: 'budget-api-keeper-monthly',
  clusterId: 'API_KEEPER',
  amount: 1000,
  period: 'monthly',
  currency: 'USD',
  alertThreshold: 80,
  enabled: true,
});
```

### Get Cost Summary

```typescript
const summary = DreamNetCostCore.getCostSummary('API_KEEPER');
console.log(`Cluster: ${summary.clusterId}`);
console.log(`Total Cost: $${summary.totalCost.toFixed(2)}`);
console.log(`Today: $${summary.costToday.toFixed(2)}`);
console.log(`This Week: $${summary.costThisWeek.toFixed(2)}`);
console.log(`This Month: $${summary.costThisMonth.toFixed(2)}`);
console.log(`Records: ${summary.recordCount}`);
```

### Get Active Alerts

```typescript
const alerts = DreamNetCostCore.getActiveAlerts();
alerts.forEach(alert => {
  console.log(`Alert: ${alert.clusterId}`);
  console.log(`Current: $${alert.currentCost}, Threshold: $${alert.threshold}`);
  console.log(`Period: ${alert.period}`);
  console.log(`Acknowledged: ${alert.acknowledged}`);
});
```

---

## Best Practices

1. **Cost Recording**
   - Record all API costs
   - Include trace IDs
   - Add metadata
   - Use consistent currencies

2. **Budget Management**
   - Set realistic budgets
   - Use appropriate periods
   - Set alert thresholds
   - Monitor regularly

3. **Alert Management**
   - Acknowledge alerts promptly
   - Investigate cost spikes
   - Adjust budgets as needed
   - Review cost patterns

4. **Cost Optimization**
   - Monitor high-cost operations
   - Optimize API usage
   - Use cost-effective providers
   - Track cost trends

---

## Security Considerations

1. **Cost Data Protection**
   - Protect cost data
   - Limit access
   - Audit cost changes
   - Secure storage

2. **Budget Security**
   - Validate budget amounts
   - Check permissions
   - Audit budget changes
   - Prevent manipulation

3. **Alert Security**
   - Secure alert delivery
   - Validate alert sources
   - Prevent alert spam
   - Audit alert acknowledgments

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

