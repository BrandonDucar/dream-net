# Website AI Designer - Complete Documentation

**Package**: `@dreamnet/website-ai-designer`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Website AI Designer integrates **ChatGPT GPT "Website AI Designer"** for automated website generation. It generates complete HTML/CSS/JS websites with deployment instructions.

### Key Features

- **Website Generation**: Generate complete websites from descriptions
- **Multi-Page Support**: Generate multiple pages
- **SEO Optimization**: SEO-optimized meta tags and structure
- **Responsive Design**: Mobile-responsive CSS
- **Deployment Instructions**: Instructions for Pixl, GitHub Pages, Netlify, Railway
- **Code Generation**: Generate HTML, CSS, and JavaScript

---

## API Reference

### Types

```typescript
export interface WebsiteDesignRequest {
  description: string;
  pages?: string[];
  style?: string;
  features?: string[];
  targetAudience?: string;
}

export interface WebsiteDesignResult {
  success: boolean;
  websiteUrl?: string;
  pages?: Array<{ name: string; url: string }>;
  assets?: Array<{ type: string; url: string }>;
  metadata?: { title: string; description: string; keywords?: string[] };
  error?: string;
}
```

### Classes

#### `WebsiteAIDesigner`

**Methods**:
- **`generateWebsite(request): Promise<WebsiteDesignResult>`**
- **`generateWebsiteCode(request): Promise<{ html: string; css: string; js: string; instructions: string }>`**

**Environment Variables**: `OPENAI_API_KEY`, `WEBSITE_AI_DESIGNER_GPT_ID`

---

**Status**: ✅ Implemented

