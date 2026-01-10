import express from 'express';

const router = express.Router();

let openai: any = null;

// Initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require('openai');
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
  } catch (error) {
    console.warn('OpenAI module not available, using fallback titles');
  }
}

// Your exact pattern implementation
router.post('/', async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        success: false, 
        error: 'OpenAI API key not configured',
        titleSuggestions: ['Creative Dream Title', 'Innovative Vision', 'Inspired Creation']
      });
    }

    const { tags, description, remix, fusion } = req.body;
    
    if (!tags || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tags and description are required' 
      });
    }

    const base = `This is a dream related to ${tags.join(', ')}. Description: ${description}.`;

    const prefix = remix
      ? "Remix of a previous dream"
      : fusion
      ? "Fusion between two dreams"
      : "Original creation";

    const prompt = `Suggest 3 creative titles for a ${prefix}. ${base}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9
    });

    const titles = response.choices?.[0]?.message?.content?.split('\n').filter(Boolean);
    
    console.log(`Generated ${titles?.length || 0} title suggestions for ${prefix}`);
    
    res.json({ titleSuggestions: titles });

  } catch (error) {
    console.error('Title generation error:', error);
    
    // Enhanced fallback titles based on dream type
    const { remix: isRemix, fusion: isFusion } = req.body;
    const fallbackTitles = isRemix
      ? ['Neural Bloom', 'The Lucid Key', 'Fractal Thread']
      : isFusion
      ? ['Synthesized Reality', 'Merged Consciousness', 'Hybrid Vision']
      : ['Neural Bloom', 'The Lucid Key', 'Fractal Thread'];

    res.json({ 
      success: false,
      error: 'Failed to generate titles with AI',
      titleSuggestions: fallbackTitles
    });
  }
});

// Alternative endpoint with different prompt strategies
router.post('/advanced', async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        success: false, 
        error: 'OpenAI API key not configured' 
      });
    }

    const { tags, description, remix, fusion, style } = req.body;
    
    const base = `This is a dream related to ${tags.join(', ')}. Description: ${description}.`;
    
    const stylePrompt = style ? ` The titles should be ${style}.` : '';
    
    const prefix = remix
      ? "Remix of a previous dream"
      : fusion
      ? "Fusion between two dreams"
      : "Original creation";

    const prompt = `Generate 5 compelling, creative titles for a ${prefix}. ${base}${stylePrompt} 
    
    Please provide titles that are:
    - Evocative and memorable
    - Related to the themes: ${tags.join(', ')}
    - Suitable for a digital dream platform
    
    Format: Return only the titles, one per line.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 200
    });

    const titles = response.choices?.[0]?.message?.content
      ?.split('\n')
      .filter(Boolean)
      .map(title => title.replace(/^\d+\.\s*/, '').trim())
      .filter(title => title.length > 0);
    
    res.json({ 
      success: true,
      titleSuggestions: titles,
      generatedWith: 'gpt-4o'
    });

  } catch (error) {
    console.error('Advanced title generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate advanced titles'
    });
  }
});

export default router;