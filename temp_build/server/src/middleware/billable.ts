/**
 * Two-Phase Commit Pattern for Billable Actions
 * Charge only after response is confirmed stored
 */

import type { Request, Response, NextFunction } from "express";
import { getTraceId } from "./traceId";
import { checkIdempotency, storeIdempotencyResponse } from "./idempotency";
import { createHash } from "crypto";

interface BillableAction {
  id: string;
  traceId: string;
  idempotencyKey: string;
  action: string;
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "charged" | "failed";
  createdAt: number;
  confirmedAt?: number;
  chargedAt?: number;
  response?: any;
}

const billableActions = new Map<string, BillableAction>();

/**
 * Generate action ID
 */
function generateActionId(): string {
  return `billable-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Two-phase commit: Phase 1 - Reserve charge
 */
export async function reserveCharge(
  idempotencyKey: string,
  action: string,
  amount: number,
  currency: string = "USD",
  traceId?: string
): Promise<{ actionId: string; reserved: boolean }> {
  const actionId = generateActionId();
  const finalTraceId = traceId || `trace-${Date.now()}`;
  
  // Check idempotency first
  const digest = createHash("sha256").update(`${idempotencyKey}-${action}-${amount}`).digest("hex").substring(0, 16);
  const { isReplay, record } = await checkIdempotency(idempotencyKey, finalTraceId, digest);
  
  if (isReplay && record) {
    // Find existing billable action
    const existing = Array.from(billableActions.values()).find(
      a => a.idempotencyKey === idempotencyKey && a.status !== "failed"
    );
    
    if (existing) {
      console.log(`💰 [Billable] Replay detected - Action: ${existing.id}, Status: ${existing.status}, Trace: ${finalTraceId}`);
      return { actionId: existing.id, reserved: existing.status === "charged" || existing.status === "confirmed" };
    }
  }
  
  // Create new billable action (pending charge)
  const billableAction: BillableAction = {
    id: actionId,
    traceId: finalTraceId,
    idempotencyKey,
    action,
    amount,
    currency,
    status: "pending",
    createdAt: Date.now(),
  };
  
  billableActions.set(actionId, billableAction);
  
  console.log(`💰 [Billable] Charge reserved - Action: ${actionId}, Amount: ${amount} ${currency}, Trace: ${finalTraceId}`);
  
  return { actionId, reserved: true };
}

/**
 * Two-phase commit: Phase 2 - Confirm and charge
 */
export async function confirmAndCharge(actionId: string, response: any): Promise<{ charged: boolean; error?: string }> {
  const action = billableActions.get(actionId);
  
  if (!action) {
    return { charged: false, error: "Action not found" };
  }
  
  if (action.status === "charged") {
    console.log(`💰 [Billable] Already charged - Action: ${actionId}, Trace: ${action.traceId}`);
    return { charged: true };
  }
  
  if (action.status === "failed") {
    return { charged: false, error: "Action previously failed" };
  }
  
  // Mark as confirmed (response stored)
  action.status = "confirmed";
  action.confirmedAt = Date.now();
  action.response = response;
  
  // Now charge (after confirmation)
  try {
    // TODO: Integrate with actual payment processor
    // For now, just mark as charged
    action.status = "charged";
    action.chargedAt = Date.now();
    
    // Store idempotency response
    storeIdempotencyResponse(action.idempotencyKey, response);
    
    console.log(`✅ [Billable] Charge confirmed - Action: ${actionId}, Amount: ${action.amount} ${action.currency}, Trace: ${action.traceId}`);
    
    return { charged: true };
  } catch (error: any) {
    action.status = "failed";
    console.error(`❌ [Billable] Charge failed - Action: ${actionId}, Error: ${error.message}, Trace: ${action.traceId}`);
    return { charged: false, error: error.message };
  }
}

/**
 * Billable action middleware - wraps billable endpoints
 */
export function billableActionMiddleware(action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const traceId = req.traceId || getTraceId(req);
    const idempotencyKey = req.headers["x-idempotency-key"] as string | undefined;
    
    if (!idempotencyKey) {
      return res.status(400).json({
        ok: false,
        error: "idempotency_key_required",
        message: "X-Idempotency-Key header required for billable actions",
      });
    }
    
    // Extract amount from request (adjust based on your API)
    const amount = req.body.amount || req.body.cost || 0;
    const currency = req.body.currency || "USD";
    
    // Phase 1: Reserve charge
    const { actionId, reserved } = await reserveCharge(idempotencyKey, action, amount, currency, traceId);
    
    if (!reserved) {
      return res.status(409).json({
        ok: false,
        error: "charge_already_processed",
        message: "This billable action was already processed",
        traceId,
        idempotencyKey,
      });
    }
    
    // Attach action ID to request
    (req as any).billableActionId = actionId;
    (req as any).billableAmount = amount;
    (req as any).billableCurrency = currency;
    
    // Override res.json to confirm charge after response
    const originalJson = res.json.bind(res);
    res.json = function(body: any) {
      // Phase 2: Confirm and charge after response is sent
      confirmAndCharge(actionId, body).catch(error => {
        console.error(`[Billable] Failed to confirm charge for ${actionId}:`, error);
      });
      
      return originalJson(body);
    };
    
    next();
  };
}

/**
 * Get billable action status
 */
export function getBillableAction(actionId: string): BillableAction | undefined {
  return billableActions.get(actionId);
}

/**
 * Get billable stats
 */
export function getBillableStats() {
  const actions = Array.from(billableActions.values());
  const pending = actions.filter(a => a.status === "pending").length;
  const confirmed = actions.filter(a => a.status === "confirmed").length;
  const charged = actions.filter(a => a.status === "charged").length;
  const failed = actions.filter(a => a.status === "failed").length;
  const totalAmount = actions.filter(a => a.status === "charged").reduce((sum, a) => sum + a.amount, 0);
  
  return {
    total: actions.length,
    pending,
    confirmed,
    charged,
    failed,
    totalAmount,
  };
}

