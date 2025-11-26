/**
 * Playwright Browser Executor
 * Real browser automation implementation using Playwright
 */

import { chromium, type Browser, type Page, type BrowserContext } from "playwright";
import type { BrowserAction, BrowserObservation, BrowserMission } from "./types";
import { validateAction, incrementMissionStep } from "./mission";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * Browser instance manager
 * Maintains a single browser instance per mission to improve performance
 */
class BrowserManager {
  private browsers = new Map<string, { browser: Browser; context: BrowserContext; page: Page }>();
  private screenshotDir: string;

  constructor() {
    this.screenshotDir = process.env.BROWSER_SCREENSHOT_DIR || "storage/browser-screenshots";
    this.ensureScreenshotDir();
  }

  private async ensureScreenshotDir(): Promise<void> {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
    } catch (error: any) {
      if (error.code !== "EEXIST") {
        console.error(`[BrowserManager] Failed to create screenshot directory:`, error);
      }
    }
  }

  /**
   * Get or create browser instance for a mission
   */
  async getBrowserForMission(missionId: string): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
    if (this.browsers.has(missionId)) {
      return this.browsers.get(missionId)!;
    }

    // Launch new browser instance
    const browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });

    // Create context with security settings
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      // Disable images and other resources for faster loading (can be configured)
      // ignoreHTTPSErrors: false, // Keep HTTPS validation
    });

    const page = await context.newPage();

    // Store for reuse
    this.browsers.set(missionId, { browser, context, page });

    return { browser, context, page };
  }

  /**
   * Close browser instance for a mission
   */
  async closeBrowserForMission(missionId: string): Promise<void> {
    const instance = this.browsers.get(missionId);
    if (instance) {
      await instance.browser.close();
      this.browsers.delete(missionId);
    }
  }

  /**
   * Get screenshot directory
   */
  getScreenshotDir(): string {
    return this.screenshotDir;
  }

  /**
   * Generate screenshot file path
   */
  getScreenshotPath(screenshotId: string): string {
    return join(this.screenshotDir, `${screenshotId}.png`);
  }

  /**
   * Generate screenshot URL (for serving via API)
   */
  getScreenshotUrl(screenshotId: string): string {
    return `/api/browser-screenshots/${screenshotId}.png`;
  }
}

const browserManager = new BrowserManager();

/**
 * Execute a browser action using Playwright
 */
export async function executeBrowserActionWithPlaywright(
  mission: BrowserMission,
  action: BrowserAction
): Promise<BrowserObservation> {
  const startTime = Date.now();

  // Validate action against mission
  validateAction(mission, action);

  // Increment step counter
  incrementMissionStep(mission.missionId);

  // Get browser instance for this mission
  const { page } = await browserManager.getBrowserForMission(mission.missionId);

  try {
    const observation = await performAction(page, mission, action);
    const duration = Date.now() - startTime;
    console.log(`[PlaywrightExecutor] Executed ${action.type} in ${duration}ms for mission ${mission.missionId}`);
    return observation;
  } catch (error: any) {
    console.error(`[PlaywrightExecutor] Error executing ${action.type}:`, error);
    return {
      url: page.url(),
      notes: `Action failed: ${error.message}`,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Perform a specific browser action
 */
async function performAction(
  page: Page,
  mission: BrowserMission,
  action: BrowserAction
): Promise<BrowserObservation> {
  switch (action.type) {
    case "open_url":
      await page.goto(action.url, { waitUntil: "networkidle", timeout: 30000 });
      const html = await page.content();
      const text = await page.textContent("body") || "";
      return {
        url: page.url(),
        htmlSnippet: html.substring(0, 5000), // Limit HTML snippet size
        textSnippet: text.substring(0, 2000), // Limit text snippet size
        notes: `Opened URL: ${action.url}`,
        success: true,
      };

    case "click":
      await page.click(action.selector, { timeout: 10000 });
      // Wait for navigation or state change
      await page.waitForTimeout(500);
      return {
        url: page.url(),
        textSnippet: `Clicked element: ${action.selector}`,
        notes: `Successfully clicked element with selector: ${action.selector}`,
        success: true,
      };

    case "type":
      await page.fill(action.selector, action.text, { timeout: 10000 });
      return {
        url: page.url(),
        textSnippet: `Typed "${action.text}" into element: ${action.selector}`,
        notes: `Successfully typed text into element with selector: ${action.selector}`,
        success: true,
      };

    case "wait":
      await page.waitForTimeout(action.ms);
      return {
        url: page.url(),
        notes: `Waited ${action.ms}ms`,
        success: true,
      };

    case "extract_text":
      const selector = action.selector || "body";
      const extractedText = await page.textContent(selector, { timeout: 10000 }) || "";
      return {
        url: page.url(),
        textSnippet: extractedText.substring(0, 5000), // Limit size
        notes: `Extracted text from selector: ${selector}`,
        success: true,
      };

    case "screenshot":
      const screenshotId = `screenshot-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const screenshotPath = browserManager.getScreenshotPath(screenshotId);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      const screenshotUrl = browserManager.getScreenshotUrl(screenshotId);
      return {
        url: page.url(),
        screenshotId,
        notes: `Screenshot captured: ${screenshotId}${action.label ? ` (${action.label})` : ""}. URL: ${screenshotUrl}`,
        success: true,
      };

    default:
      return {
        url: page.url(),
        notes: `Unknown action type: ${(action as any).type}`,
        success: false,
        error: `Unknown action type: ${(action as any).type}`,
      };
  }
}

/**
 * Execute multiple actions sequentially
 */
export async function executeActionSequenceWithPlaywright(
  mission: BrowserMission,
  actions: BrowserAction[]
): Promise<BrowserObservation[]> {
  const observations: BrowserObservation[] = [];

  for (const action of actions) {
    try {
      const observation = await executeBrowserActionWithPlaywright(mission, action);
      observations.push(observation);
      
      // Stop if action failed
      if (!observation.success) {
        break;
      }
    } catch (error: any) {
      observations.push({
        url: "unknown",
        notes: `Error executing action: ${error.message}`,
        success: false,
        error: error.message,
      });
      break;
    }
  }

  return observations;
}

/**
 * Clean up browser instance for a mission
 */
export async function cleanupBrowserForMission(missionId: string): Promise<void> {
  await browserManager.closeBrowserForMission(missionId);
}

/**
 * Get screenshot file path
 */
export function getScreenshotPath(screenshotId: string): string {
  return browserManager.getScreenshotPath(screenshotId);
}

/**
 * Get screenshot URL
 */
export function getScreenshotUrl(screenshotId: string): string {
  return browserManager.getScreenshotUrl(screenshotId);
}

