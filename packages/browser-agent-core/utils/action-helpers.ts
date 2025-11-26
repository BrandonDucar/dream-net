/**
 * Browser Action Helpers
 * Utility functions for common browser action patterns
 */

import type { BrowserAction } from "../types";

/**
 * Create a sequence of actions for form filling
 */
export function createFormFillSequence(formData: Record<string, string>): BrowserAction[] {
  const actions: BrowserAction[] = [];

  // Common field selectors to try
  const fieldSelectors: Record<string, string[]> = {
    name: ["#name", "#full-name", "input[name='name']", "input[placeholder*='name' i]"],
    email: ["#email", "#email-address", "input[type='email']", "input[name='email']"],
    company: ["#company", "#company-name", "input[name='company']"],
    description: ["#description", "#about", "textarea[name='description']", "#bio"],
    website: ["#website", "#url", "input[name='website']", "input[type='url']"],
    phone: ["#phone", "#phone-number", "input[name='phone']", "input[type='tel']"],
    message: ["#message", "#comments", "textarea[name='message']"],
  };

  for (const [key, value] of Object.entries(formData)) {
    const selectors = fieldSelectors[key.toLowerCase()] || [`#${key}`, `input[name='${key}']`];
    
    // Try the first selector (most common)
    actions.push({
      type: "type",
      selector: selectors[0],
      text: value,
    });
  }

  return actions;
}

/**
 * Create a navigation sequence
 */
export function createNavigationSequence(urls: string[]): BrowserAction[] {
  return urls.map(url => ({
    type: "open_url",
    url,
  }));
}

/**
 * Create a wait sequence with multiple waits
 */
export function createWaitSequence(delays: number[]): BrowserAction[] {
  return delays.map(ms => ({
    type: "wait",
    ms,
  }));
}

/**
 * Create a screenshot sequence for multiple pages
 */
export function createScreenshotSequence(labels: string[]): BrowserAction[] {
  return labels.map(label => ({
    type: "screenshot",
    label,
  }));
}

/**
 * Create a click sequence for multiple elements
 */
export function createClickSequence(selectors: string[]): BrowserAction[] {
  return selectors.map(selector => ({
    type: "click",
    selector,
  }));
}

/**
 * Create a text extraction sequence for multiple elements
 */
export function createExtractSequence(selectors: string[]): BrowserAction[] {
  return selectors.map(selector => ({
    type: "extract_text",
    selector,
  }));
}

/**
 * Combine multiple action sequences
 */
export function combineActionSequences(...sequences: BrowserAction[][]): BrowserAction[] {
  return sequences.flat();
}

/**
 * Add wait between actions
 */
export function addWaitsBetweenActions(actions: BrowserAction[], waitMs: number = 1000): BrowserAction[] {
  const result: BrowserAction[] = [];
  
  for (let i = 0; i < actions.length; i++) {
    result.push(actions[i]);
    if (i < actions.length - 1) {
      result.push({ type: "wait", ms: waitMs });
    }
  }
  
  return result;
}

