/**
 * Website AI Designer API Helpers
 * Functions to generate websites using Website AI Designer GPT
 */

export interface WebsiteDesignRequest {
  description: string;
  pages?: string[];
  style?: string;
  features?: string[];
  targetAudience?: string;
}

export interface WebsiteCode {
  html: string;
  css: string;
  js: string;
  instructions: string;
}

/**
 * Generate a website using Website AI Designer
 */
export async function generateWebsite(request: WebsiteDesignRequest) {
  try {
    const response = await fetch('/api/website-designer/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) throw new Error('Failed to generate website');
    return await response.json();
  } catch (error) {
    console.error('Error generating website:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate website code (HTML/CSS/JS)
 */
export async function generateWebsiteCode(request: WebsiteDesignRequest): Promise<{
  success: boolean;
  code?: WebsiteCode;
  error?: string;
}> {
  try {
    const response = await fetch('/api/website-designer/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) throw new Error('Failed to generate website code');
    return await response.json();
  } catch (error) {
    console.error('Error generating website code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if Website AI Designer is available
 */
export async function checkWebsiteDesignerHealth() {
  try {
    const response = await fetch('/api/website-designer/health');
    if (!response.ok) throw new Error('Health check failed');
    return await response.json();
  } catch (error) {
    console.error('Error checking website designer health:', error);
    return {
      success: false,
      available: false,
    };
  }
}

