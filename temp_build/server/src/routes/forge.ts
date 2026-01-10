import { Router, type Request, type Response } from "express";
import { db } from "../db";
import {
  forgeCollections,
  forgeRequests,
  forgeEnvironments,
  forgeHistory,
  type InsertForgeCollection,
  type InsertForgeRequest,
  type InsertForgeEnvironment,
  type InsertForgeHistory,
} from "@dreamnet/shared/schema";
import { eq, desc, and } from "drizzle-orm";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { VM } from "vm2";
import { updateTraitsFromEvent } from "../../packages/memory-dna";

/**
 * Dream API Forge Router
 * Provides REST API for managing API collections, requests, environments, and execution history.
 */

export function createForgeRouter(): Router {
  const router = Router();

  // ============================================
  // Collections CRUD
  // ============================================

  router.get("/forge/collections", async (_req, res) => {
    try {
      const collections = await db.select().from(forgeCollections).orderBy(desc(forgeCollections.createdAt));
      res.json({ ok: true, collections });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.post("/forge/collections", async (req, res) => {
    try {
      const body = req.body as Partial<InsertForgeCollection>;
      if (!body.name) {
        res.status(400).json({ ok: false, error: "name is required" });
        return;
      }
      const [collection] = await db
        .insert(forgeCollections)
        .values({
          name: body.name,
          description: body.description ?? null,
          tags: body.tags ?? [],
          metadata: body.metadata ?? {},
        })
        .returning();
      res.json({ ok: true, collection });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.put("/forge/collections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body as Partial<InsertForgeCollection>;
      const [collection] = await db
        .update(forgeCollections)
        .set({
          name: body.name,
          description: body.description ?? null,
          tags: body.tags,
          metadata: body.metadata,
          updatedAt: new Date(),
        })
        .where(eq(forgeCollections.id, id))
        .returning();
      if (!collection) {
        res.status(404).json({ ok: false, error: "Collection not found" });
        return;
      }
      res.json({ ok: true, collection });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.delete("/forge/collections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(forgeCollections).where(eq(forgeCollections.id, id));
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // ============================================
  // Requests CRUD
  // ============================================

  router.get("/forge/collections/:collectionId/requests", async (req, res) => {
    try {
      const { collectionId } = req.params;
      const requests = await db
        .select()
        .from(forgeRequests)
        .where(eq(forgeRequests.collectionId, collectionId))
        .orderBy(desc(forgeRequests.createdAt));
      res.json({ ok: true, requests });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.post("/forge/collections/:collectionId/requests", async (req, res) => {
    try {
      const { collectionId } = req.params;
      const body = req.body as Partial<InsertForgeRequest>;
      if (!body.name || !body.method || !body.url) {
        res.status(400).json({ ok: false, error: "name, method, and url are required" });
        return;
      }
      const [request] = await db
        .insert(forgeRequests)
        .values({
          collectionId,
          name: body.name,
          method: body.method,
          url: body.url,
          headers: body.headers ?? {},
          body: body.body ?? null,
          auth: body.auth ?? { type: "none" },
          testScript: body.testScript ?? null,
          tags: body.tags ?? [],
          metadata: body.metadata ?? {},
        })
        .returning();
      res.json({ ok: true, request });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/forge/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [request] = await db.select().from(forgeRequests).where(eq(forgeRequests.id, id));
      if (!request) {
        res.status(404).json({ ok: false, error: "Request not found" });
        return;
      }
      res.json({ ok: true, request });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.put("/forge/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body as Partial<InsertForgeRequest>;
      const [request] = await db
        .update(forgeRequests)
        .set({
          name: body.name,
          method: body.method,
          url: body.url,
          headers: body.headers,
          body: body.body ?? null,
          auth: body.auth,
          testScript: body.testScript ?? null,
          tags: body.tags,
          metadata: body.metadata,
          updatedAt: new Date(),
        })
        .where(eq(forgeRequests.id, id))
        .returning();
      if (!request) {
        res.status(404).json({ ok: false, error: "Request not found" });
        return;
      }
      res.json({ ok: true, request });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.delete("/forge/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(forgeRequests).where(eq(forgeRequests.id, id));
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // ============================================
  // Environments CRUD
  // ============================================

  router.get("/forge/environments", async (_req, res) => {
    try {
      const environments = await db.select().from(forgeEnvironments).orderBy(desc(forgeEnvironments.createdAt));
      res.json({ ok: true, environments });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.post("/forge/environments", async (req, res) => {
    try {
      const body = req.body as Partial<InsertForgeEnvironment>;
      if (!body.name) {
        res.status(400).json({ ok: false, error: "name is required" });
        return;
      }
      const [environment] = await db
        .insert(forgeEnvironments)
        .values({
          name: body.name,
          variables: body.variables ?? {},
        })
        .returning();
      res.json({ ok: true, environment });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.put("/forge/environments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body as Partial<InsertForgeEnvironment>;
      const [environment] = await db
        .update(forgeEnvironments)
        .set({
          name: body.name,
          variables: body.variables,
          updatedAt: new Date(),
        })
        .where(eq(forgeEnvironments.id, id))
        .returning();
      if (!environment) {
        res.status(404).json({ ok: false, error: "Environment not found" });
        return;
      }
      res.json({ ok: true, environment });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.delete("/forge/environments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(forgeEnvironments).where(eq(forgeEnvironments.id, id));
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // ============================================
  // History
  // ============================================

  router.get("/forge/requests/:id/history", async (req, res) => {
    try {
      const { id } = req.params;
      const history = await db
        .select()
        .from(forgeHistory)
        .where(eq(forgeHistory.requestId, id))
        .orderBy(desc(forgeHistory.createdAt))
        .limit(50);
      res.json({ ok: true, history });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  router.get("/forge/history/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await db
        .select()
        .from(forgeHistory)
        .orderBy(desc(forgeHistory.createdAt))
        .limit(limit);
      res.json({ ok: true, history });
    } catch (error) {
      res.status(500).json({ ok: false, error: (error as Error).message });
    }
  });

  // ============================================
  // Request Execution
  // ============================================

  router.post("/forge/execute", async (req, res) => {
    const startTime = Date.now();
    let requestSnapshot: InsertForgeHistory["requestSnapshot"] | null = null;
    let responseSnapshot: InsertForgeHistory["responseSnapshot"] | null = null;
    let testResults: InsertForgeHistory["testResults"] | null = null;
    let error: string | null = null;

    try {
      const body = req.body as {
        requestId: string;
        environmentId?: string;
        overrides?: {
          method?: string;
          url?: string;
          headers?: Record<string, string>;
          body?: string;
        };
      };

      if (!body.requestId) {
        res.status(400).json({ ok: false, error: "requestId is required" });
        return;
      }

      // Fetch request
      const [request] = await db.select().from(forgeRequests).where(eq(forgeRequests.id, body.requestId));
      if (!request) {
        res.status(404).json({ ok: false, error: "Request not found" });
        return;
      }

      // Fetch environment if provided
      let envVars: Record<string, string> = {};
      if (body.environmentId) {
        const [env] = await db.select().from(forgeEnvironments).where(eq(forgeEnvironments.id, body.environmentId));
        if (env) {
          envVars = env.variables as Record<string, string>;
        }
      }

      // Resolve environment variables in URL, headers, and body
      const resolveVars = (str: string): string => {
        return str.replace(/\{\{(\w+)\}\}/g, (_, key) => envVars[key] ?? `{{${key}}}`);
      };

      const method = (body.overrides?.method || request.method) as string;
      let url = resolveVars(body.overrides?.url || request.url);
      let headers: Record<string, string> = { ...(request.headers as Record<string, string>) };
      let bodyText = resolveVars(body.overrides?.body || request.body || "");

      // Apply overrides
      if (body.overrides?.headers) {
        Object.entries(body.overrides.headers).forEach(([k, v]) => {
          headers[resolveVars(k)] = resolveVars(v);
        });
      }

      // Apply auth
      const auth = request.auth as {
        type?: "bearer" | "basic" | "apikey" | "none";
        token?: string;
        username?: string;
        password?: string;
        apiKey?: string;
        apiKeyLocation?: "header" | "query";
      };

      if (auth.type === "bearer" && auth.token) {
        headers["Authorization"] = `Bearer ${resolveVars(auth.token)}`;
      } else if (auth.type === "basic" && auth.username && auth.password) {
        const credentials = Buffer.from(`${resolveVars(auth.username)}:${resolveVars(auth.password)}`).toString("base64");
        headers["Authorization"] = `Basic ${credentials}`;
      } else if (auth.type === "apikey" && auth.apiKey) {
        const key = resolveVars(auth.apiKey);
        if (auth.apiKeyLocation === "query") {
          const urlObj = new URL(url);
          urlObj.searchParams.set("api_key", key);
          url = urlObj.toString();
        } else {
          headers["X-API-Key"] = key;
        }
      }

      // Prepare request snapshot
      requestSnapshot = {
        method,
        url,
        headers,
        body: bodyText || undefined,
      };

      // Execute HTTP request
      const axiosConfig: AxiosRequestConfig = {
        method: method as any,
        url,
        headers,
        data: bodyText || undefined,
        validateStatus: () => true, // Don't throw on any status
        timeout: 30000, // 30s timeout
      };

      let axiosResponse: AxiosResponse;
      try {
        axiosResponse = await axios(axiosConfig);
      } catch (err: any) {
        error = err.message || "Network error";
        // Emit Event Wormhole event for API failure
        try {
          const { emitEvent } = await import("../../packages/event-wormholes");
          await emitEvent({
            sourceType: "api",
            eventType: "api.endpoint.failed",
            severity: "error",
            payload: {
              requestId: body.requestId,
              url,
              method,
              error: error,
            },
          });
        } catch {
          // Event Wormholes not available, continue
        }
        throw err;
      }

      const durationMs = Date.now() - startTime;
      const responseBody = typeof axiosResponse.data === "string" ? axiosResponse.data : JSON.stringify(axiosResponse.data);
      const responseSize = Buffer.byteLength(responseBody, "utf8");

      responseSnapshot = {
        status: axiosResponse.status,
        headers: axiosResponse.headers as Record<string, string>,
        body: responseBody,
        size: responseSize,
      };

      // Run test script if present
      if (request.testScript) {
        try {
          testResults = runTestScript(request.testScript, {
            status: axiosResponse.status,
            headers: axiosResponse.headers as Record<string, string>,
            body: responseBody,
            durationMs,
          });
        } catch (testErr: any) {
          testResults = {
            passed: 0,
            failed: 1,
            logs: [],
            errors: [testErr.message || "Test script execution failed"],
          };
        }
      }

      // Emit event if request failed or test failed
      if (axiosResponse.status >= 400 || (testResults && testResults.failed > 0)) {
        try {
          const { emitEvent } = await import("../../packages/event-wormholes");
          await emitEvent({
            sourceType: "api",
            eventType: "api.endpoint.failed",
            severity: axiosResponse.status >= 500 ? "error" : "warning",
            payload: {
              requestId: body.requestId,
              url,
              statusCode: axiosResponse.status,
              testFailed: testResults?.failed > 0,
            },
          });
        } catch {
          // Event Wormholes not available, continue
        }
      }

      // Save history
      const [history] = await db
        .insert(forgeHistory)
        .values({
          requestId: body.requestId,
          environmentId: body.environmentId || null,
          statusCode: axiosResponse.status,
          durationMs,
          requestSnapshot,
          responseSnapshot,
          testResults,
          error: null,
        })
        .returning();

      await updateTraitsFromEvent({
        id: history.id,
        timestamp: new Date().toISOString(),
        sourceType: "api",
        eventType: "api.endpoint.success",
        severity: "info",
        payload: {
          requestId: body.requestId,
          url,
          statusCode: axiosResponse.status,
          durationMs,
        },
        handled: true,
      });

      res.json({
        ok: true,
        response: {
          status: axiosResponse.status,
          headers: axiosResponse.headers,
          body: responseBody,
          durationMs,
          size: responseSize,
        },
        testResults,
        historyId: history.id,
      });
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      error = err.message || "Execution failed";

      // Save error history if we have a request snapshot
      const body = req.body as { requestId: string; environmentId?: string };
      if (requestSnapshot && body?.requestId) {
        try {
          await db.insert(forgeHistory).values({
            requestId: body.requestId,
            environmentId: body?.environmentId || null,
            statusCode: null,
            durationMs,
            requestSnapshot,
            responseSnapshot: responseSnapshot || {
              status: 0,
              headers: {},
              body: error,
            },
            testResults: null,
            error,
          });
        } catch {
          // Ignore history save errors
        }
      }

      await updateTraitsFromEvent({
        id: `${body?.requestId ?? "unknown"}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sourceType: "api",
        eventType: "api.endpoint.failed",
        severity: "error",
        payload: {
          requestId: body?.requestId,
          url: requestSnapshot?.url,
          statusCode: responseSnapshot?.status ?? 0,
          error,
        },
        handled: false,
      });

      res.status(500).json({
        ok: false,
        error,
        durationMs,
        requestSnapshot,
      });
    }
  });

  return router;
}

/**
 * Run test script in a sandboxed VM
 * Provides forge.* helpers for assertions
 */
function runTestScript(
  script: string,
  response: {
    status: number;
    headers: Record<string, string>;
    body: string;
    durationMs: number;
  }
): InsertForgeHistory["testResults"] {
  const logs: string[] = [];
  const errors: string[] = [];
  let passed = 0;
  let failed = 0;

  const forge = {
    expectStatus: (expected: number) => {
      if (response.status === expected) {
        passed++;
        logs.push(`✓ Status is ${expected}`);
      } else {
        failed++;
        errors.push(`✗ Expected status ${expected}, got ${response.status}`);
      }
    },
    expectHeader: (name: string, value: string) => {
      const actual = response.headers[name.toLowerCase()];
      if (actual === value) {
        passed++;
        logs.push(`✓ Header ${name} is ${value}`);
      } else {
        failed++;
        errors.push(`✗ Expected header ${name} to be ${value}, got ${actual}`);
      }
    },
    expectBodyContains: (text: string) => {
      if (response.body.includes(text)) {
        passed++;
        logs.push(`✓ Body contains "${text}"`);
      } else {
        failed++;
        errors.push(`✗ Body does not contain "${text}"`);
      }
    },
    log: (message: string) => {
      logs.push(`[LOG] ${message}`);
    },
    response: {
      status: response.status,
      headers: response.headers,
      body: response.body,
      durationMs: response.durationMs,
    },
  };

  try {
    const vm = new VM({
      timeout: 5000, // 5s max execution
      sandbox: {
        forge,
        console: {
          log: (...args: any[]) => {
            logs.push(`[CONSOLE] ${args.map(String).join(" ")}`);
          },
        },
      },
    });

    vm.run(script);
  } catch (err: any) {
    errors.push(`Script error: ${err.message}`);
    failed++;
  }

  return {
    passed,
    failed,
    logs,
    errors,
  };
}

