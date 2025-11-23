/**
 * Website AI Designer Integration
 * Integrates ChatGPT GPT "Website AI Designer" for automated website generation
 * Uses Pixl or similar platform for direct website deployment (no Vercel needed)
 */
import OpenAI from 'openai';
export class WebsiteAIDesigner {
    openai = null;
    gptId;
    constructor(gptId) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        }
        // Website AI Designer GPT ID (if using custom GPT)
        this.gptId = gptId || process.env.WEBSITE_AI_DESIGNER_GPT_ID || 'g-rLwPjHrHR';
    }
    /**
     * Generate a website using Website AI Designer GPT
     */
    async generateWebsite(request) {
        if (!this.openai) {
            return {
                success: false,
                error: 'OpenAI API key not configured. Set OPENAI_API_KEY environment variable.',
            };
        }
        try {
            // Build prompt for website generation
            const prompt = this.buildWebsitePrompt(request);
            // Option 1: Use Assistants API if GPT is configured as an Assistant
            // Option 2: Use Chat Completions with system message to simulate GPT behavior
            // Option 3: Direct API call to custom GPT endpoint (if available)
            // For now, using Chat Completions with GPT-4o to simulate the GPT
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are Website AI Designer, a professional website builder GPT. 
            Your mission is to simplify the creation of professional-looking & optimized websites 
            to cover 98% of Start-Up and Small Business needs.
            
            You can:
            - Generate multipage websites
            - Add logos and images
            - Add blocks to pages
            - Create optimized, professional websites
            
            When generating websites, provide:
            1. Complete HTML/CSS/JS code
            2. Deployment instructions
            3. Asset requirements
            4. SEO optimization suggestions`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 4000,
            });
            const content = response.choices[0]?.message?.content || '';
            // Parse the response to extract website information
            return this.parseWebsiteResponse(content, request);
        }
        catch (error) {
            console.error('[WebsiteAIDesigner] Generation error:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate website',
            };
        }
    }
    /**
     * Build prompt for website generation
     */
    buildWebsitePrompt(request) {
        let prompt = `Create a professional website with the following requirements:\n\n`;
        prompt += `Description: ${request.description}\n\n`;
        if (request.pages && request.pages.length > 0) {
            prompt += `Pages needed:\n`;
            request.pages.forEach((page, idx) => {
                prompt += `${idx + 1}. ${page}\n`;
            });
            prompt += `\n`;
        }
        if (request.style) {
            prompt += `Style: ${request.style}\n`;
        }
        if (request.features && request.features.length > 0) {
            prompt += `Features: ${request.features.join(', ')}\n`;
        }
        if (request.targetAudience) {
            prompt += `Target Audience: ${request.targetAudience}\n`;
        }
        prompt += `\nPlease generate:\n`;
        prompt += `1. Complete HTML structure\n`;
        prompt += `2. CSS styling (modern, responsive)\n`;
        prompt += `3. JavaScript for interactivity (if needed)\n`;
        prompt += `4. SEO-optimized meta tags\n`;
        prompt += `5. Deployment-ready code\n`;
        return prompt;
    }
    /**
     * Parse GPT response to extract website information
     */
    parseWebsiteResponse(content, request) {
        // Try to extract website URL if provided
        const urlMatch = content.match(/https?:\/\/[^\s]+/);
        const websiteUrl = urlMatch ? urlMatch[0] : undefined;
        // Extract code blocks
        const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
        const cssMatch = content.match(/```css\n([\s\S]*?)```/);
        const jsMatch = content.match(/```javascript\n([\s\S]*?)```/);
        // Extract metadata
        const titleMatch = content.match(/<title>(.*?)<\/title>/i) ||
            content.match(/Title:\s*(.+)/i);
        const title = titleMatch ? titleMatch[1] : request.description.substring(0, 50);
        return {
            success: true,
            websiteUrl,
            pages: request.pages?.map((page, idx) => ({
                name: page,
                url: websiteUrl ? `${websiteUrl}/${page.toLowerCase().replace(/\s+/g, '-')}` : '',
            })) || [],
            assets: [],
            metadata: {
                title,
                description: request.description,
                keywords: request.features || [],
            },
        };
    }
    /**
     * Generate website code (HTML/CSS/JS)
     */
    async generateWebsiteCode(request) {
        const result = await this.generateWebsite(request);
        if (!result.success) {
            throw new Error(result.error || 'Failed to generate website');
        }
        // Generate code based on request
        const html = this.generateHTML(request, result);
        const css = this.generateCSS(request);
        const js = this.generateJS(request);
        const instructions = this.generateDeploymentInstructions(result);
        return {
            html,
            css,
            js,
            instructions,
        };
    }
    generateHTML(request, result) {
        const pages = request.pages || ['Home', 'About', 'Contact'];
        const title = result.metadata?.title || 'New Website';
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${request.description}">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">${title}</div>
            <ul>
                ${pages.map(page => `<li><a href="#${page.toLowerCase()}">${page}</a></li>`).join('\n                ')}
            </ul>
        </nav>
    </header>
    
    <main>
        ${pages.map((page, idx) => `
        <section id="${page.toLowerCase()}" class="page-section">
            <h1>${page}</h1>
            <p>${request.description}</p>
        </section>
        `).join('\n        ')}
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} ${title}. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`;
    }
    generateCSS(request) {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
}

header {
    background: #000;
    color: #fff;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
}

nav a:hover {
    color: #00D2FF;
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.page-section {
    margin-bottom: 4rem;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #000;
}

footer {
    background: #000;
    color: #fff;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    nav ul {
        flex-direction: column;
        gap: 1rem;
    }
    
    h1 {
        font-size: 2rem;
    }
}`;
    }
    generateJS(request) {
        return `// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add any interactive features here
console.log('Website loaded successfully');`;
    }
    generateDeploymentInstructions(result) {
        return `# Website Deployment Instructions

## Files Generated
- index.html (main HTML file)
- styles.css (CSS styling)
- script.js (JavaScript)

## Deployment Options

### Option 1: Pixl (Recommended)
1. Go to pixl.com (or your Pixl platform)
2. Upload the generated files
3. Website will be live immediately

### Option 2: GitHub Pages
1. Create a new GitHub repository
2. Upload files to repository
3. Enable GitHub Pages in settings
4. Website will be available at: https://yourusername.github.io/repo-name

### Option 3: Netlify Drop
1. Go to app.netlify.com/drop
2. Drag and drop the files
3. Website will be live instantly

### Option 4: Railway
1. Create new Railway project
2. Upload files
3. Configure static site deployment
4. Deploy

## Next Steps
- Customize content in index.html
- Update styles in styles.css
- Add interactivity in script.js
- Add images and assets as needed`;
    }
}
// Export singleton instance
let designerInstance = null;
export function getWebsiteDesigner() {
    if (!designerInstance) {
        designerInstance = new WebsiteAIDesigner();
    }
    return designerInstance;
}
export default WebsiteAIDesigner;
