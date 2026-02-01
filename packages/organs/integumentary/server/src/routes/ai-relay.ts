import { Router } from 'express';
import { BudgetControlService } from '../services/BudgetControlService';
import { IntegrationFlagsService } from '../services/IntegrationFlagsService';
import { brainGate } from '@dreamnet/nerve';

const router = Router();

// OpenAI relay endpoint with budget control
router.post('/openai/chat', async (req, res) => {
  try {
    // Check if OpenAI integration is enabled
    await IntegrationFlagsService.requireEnabled('openai');

    // Estimate cost (rough approximation: $0.01 per request)
    const estimatedCost = 0.01;

    // Check budget before making request
    BudgetControlService.requireBudget('openai', estimatedCost);

    const { messages, model = 'gpt-4o' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    // Call Sovereign BrainGate
    const completion = await brainGate.chat(messages, { model });

    // Record usage after successful request
    BudgetControlService.recordUsage('openai', estimatedCost);

    // Return real response but with cost metadata
    res.json({
      ...completion,
      cost: estimatedCost
    });

    console.log(`🤖 [OpenAI] Sovereign Chat completion successful - Cost: $${estimatedCost}`);

  } catch (error: any) {
    console.error('[OpenAI] Request failed:', error.message);

    if (error.message.includes('over budget')) {
      res.status(429).json({
        error: 'Over budget',
        message: error.message,
        provider: 'openai',
        budget_status: BudgetControlService.getBudgetStatus('openai')
      });
    } else if (error.message.includes('disabled')) {
      res.status(503).json({
        error: 'Service disabled',
        message: error.message,
        provider: 'openai'
      });
    } else {
      res.status(500).json({
        error: 'Request failed',
        message: error.message
      });
    }
  }
});

// Koala relay endpoint with kill switch testing
router.post('/koala/generate', async (req, res) => {
  try {
    // Check if Koala integration is enabled (this will test kill switch)
    await IntegrationFlagsService.requireEnabled('koala');

    // Check budget
    const estimatedCost = 0.005;
    BudgetControlService.requireBudget('koala', estimatedCost);

    // Simulate Koala API call
    const { prompt, max_tokens = 100 } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Invalid request: prompt is required'
      });
    }

    // Record usage
    BudgetControlService.recordUsage('koala', estimatedCost);

    // Simulate response
    const response = {
      id: `koala-${Date.now()}`,
      object: 'text_completion',
      created: Math.floor(Date.now() / 1000),
      model: 'koala-13b',
      choices: [{
        text: 'This is a simulated Koala response for kill switch testing. Integration is enabled and working.',
        index: 0,
        logprobs: null,
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: prompt.split(' ').length,
        completion_tokens: max_tokens,
        total_tokens: prompt.split(' ').length + max_tokens
      },
      cost: estimatedCost
    };

    console.log(`🐨 [Koala] Generation successful - Cost: $${estimatedCost}`);

    res.json(response);
  } catch (error) {
    console.error('[Koala] Request failed:', error.message);

    if (error.message.includes('over budget')) {
      res.status(429).json({
        error: 'Over budget',
        message: error.message,
        provider: 'koala',
        budget_status: BudgetControlService.getBudgetStatus('koala')
      });
    } else if (error.message.includes('disabled')) {
      // This is the kill switch test - integration disabled
      res.status(503).json({
        error: 'Integration disabled',
        message: 'Koala integration has been disabled via kill switch',
        provider: 'koala',
        kill_switch_active: true
      });
    } else {
      res.status(500).json({
        error: 'Request failed',
        message: error.message
      });
    }
  }
});

// Anthropic relay endpoint with budget control
router.post('/anthropic/messages', async (req, res) => {
  try {
    await IntegrationFlagsService.requireEnabled('anthropic');

    const estimatedCost = 0.015;
    BudgetControlService.requireBudget('anthropic', estimatedCost);

    const { messages, model = 'claude-3-sonnet-20240229' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    BudgetControlService.recordUsage('anthropic', estimatedCost);

    const response = {
      id: `msg_${Date.now()}`,
      type: 'message',
      role: 'assistant',
      content: [{
        type: 'text',
        text: 'This is a simulated Anthropic response for budget control testing.'
      }],
      model,
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: {
        input_tokens: 50,
        output_tokens: 20
      },
      cost: estimatedCost
    };

    console.log(`🤖 [Anthropic] Message completion successful - Cost: $${estimatedCost}`);

    res.json(response);
  } catch (error) {
    console.error('[Anthropic] Request failed:', error.message);

    if (error.message.includes('over budget')) {
      res.status(429).json({
        error: 'Over budget',
        message: error.message,
        provider: 'anthropic',
        budget_status: BudgetControlService.getBudgetStatus('anthropic')
      });
    } else if (error.message.includes('disabled')) {
      res.status(503).json({
        error: 'Service disabled',
        message: error.message,
        provider: 'anthropic'
      });
    } else {
      res.status(500).json({
        error: 'Request failed',
        message: error.message
      });
    }
  }
});

export default router;