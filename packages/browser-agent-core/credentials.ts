/**
 * Credential Profile Management
 * Credentials are NEVER exposed to the model - they live in env/secrets
 */

import type { CredentialProfile } from "./types";

/**
 * Credential profile configuration
 */
interface CredentialConfig {
  profile: CredentialProfile;
  username?: string; // For reference only, not the actual credential
  loginUrl?: string;
  loginSelectors?: {
    username?: string;
    password?: string;
    submit?: string;
  };
}

/**
 * Credential profiles (stub - real implementation in Phase 2)
 */
const credentialProfiles: Record<CredentialProfile, CredentialConfig> = {
  dreamnet_admin: {
    profile: "dreamnet_admin",
    username: "admin@dreamnet.ink", // Reference only
    loginUrl: "https://dreamnet.ink/admin/login",
    loginSelectors: {
      username: "#email",
      password: "#password",
      submit: "button[type='submit']",
    },
  },
  partner_dashboard: {
    profile: "partner_dashboard",
    username: "partner@example.com", // Reference only
    loginUrl: "https://partner.dreamnet.ink/login",
    loginSelectors: {
      username: "#username",
      password: "#password",
      submit: "button.login",
    },
  },
  test_account: {
    profile: "test_account",
    username: "test@dreamnet.ink", // Reference only
    loginUrl: "https://dreamnet.ink/test/login",
    loginSelectors: {
      username: "#test-email",
      password: "#test-password",
      submit: "button[type='submit']",
    },
  },
};

/**
 * Browser login using credential profile
 * 
 * Phase 2 Implementation: Real Playwright-based login
 * Credentials are NEVER exposed to the model - they are loaded from env/secrets
 */
export async function browserLogin(profile: CredentialProfile): Promise<{
  success: boolean;
  message: string;
  page?: any; // Playwright Page object for continued use
}> {
  const config = credentialProfiles[profile];
  
  if (!config) {
    return {
      success: false,
      message: `Unknown credential profile: ${profile}`,
    };
  }

  // Load credentials from environment (never expose to model)
  const username = process.env[`BROWSER_CREDENTIALS_${profile.toUpperCase()}_USERNAME`];
  const password = process.env[`BROWSER_CREDENTIALS_${profile.toUpperCase()}_PASSWORD`];

  if (!username || !password) {
    return {
      success: false,
      message: `Credentials not found for profile ${profile}. Set BROWSER_CREDENTIALS_${profile.toUpperCase()}_USERNAME and BROWSER_CREDENTIALS_${profile.toUpperCase()}_PASSWORD environment variables.`,
    };
  }

  if (!config.loginUrl || !config.loginSelectors) {
    return {
      success: false,
      message: `Login configuration incomplete for profile ${profile}`,
    };
  }

  try {
    // Use Playwright for real login
    const { chromium, Browser, Page } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to login URL
    await page.goto(config.loginUrl, { waitUntil: "networkidle", timeout: 30000 });

    // Fill in username
    if (config.loginSelectors.username) {
      await page.fill(config.loginSelectors.username, username, { timeout: 10000 });
    }

    // Fill in password
    if (config.loginSelectors.password) {
      await page.fill(config.loginSelectors.password, password, { timeout: 10000 });
    }

    // Submit form
    if (config.loginSelectors.submit) {
      await page.click(config.loginSelectors.submit, { timeout: 10000 });
    } else {
      // Try pressing Enter if no submit button selector
      await page.press(config.loginSelectors.password || config.loginSelectors.username || "body", "Enter");
    }

    // Wait for navigation or success indicator
    await page.waitForTimeout(2000);

    // Check if login was successful (basic check - URL change or presence of logout button)
    const currentUrl = page.url();
    const loginSuccessful = !currentUrl.includes("login") && currentUrl !== config.loginUrl;

    if (loginSuccessful) {
      console.log(`[BrowserCredentials] Login successful with profile ${profile}`);
      return {
        success: true,
        message: `Login successful with profile ${profile}`,
        page, // Return page for continued use
      };
    } else {
      await browser.close();
      return {
        success: false,
        message: `Login may have failed - still on login page. Check credentials and selectors.`,
      };
    }
  } catch (error: any) {
    console.error(`[BrowserCredentials] Login failed for profile ${profile}:`, error);
    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }
}

/**
 * Get credential profile configuration
 */
export function getCredentialProfile(profile: CredentialProfile): CredentialConfig | undefined {
  return credentialProfiles[profile];
}

/**
 * List available credential profiles
 */
export function listCredentialProfiles(): CredentialProfile[] {
  return Object.keys(credentialProfiles) as CredentialProfile[];
}

