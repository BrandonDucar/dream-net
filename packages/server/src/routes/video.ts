import { Router } from 'express';

const router: Router = Router();

// Video processor is optional
let processVideoJob: any = null;
try {
  const videoModule = require('../utils/videoProcessor');
  processVideoJob = videoModule.processVideoJob;
} catch {
  console.warn("[Video Router] Video processor not available");
}

// POST /api/video/process - Process video job
router.post('/process', async (req, res) => {
  try {
    const jobSpec = req.body;
    
    if (!jobSpec.job_id && !jobSpec.title) {
      return res.status(400).json({
        error: 'Missing job_id or title in job specification'
      });
    }

    if (!jobSpec.sources?.clips?.length) {
      return res.status(400).json({
        error: 'No video clips provided in job specification'
      });
    }

    const result = await processVideoJob(jobSpec);
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Video processing failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/video/status/:job_id - Get processing status
router.get('/status/:job_id', async (req, res) => {
  try {
    const { job_id } = req.params;
    
    // Check if files exist
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    
    const previewPath = path.join('public/previews', `${job_id}_preview.mp4`);
    const exportPath = path.join('public/exports');
    
    const [previewExists] = await Promise.allSettled([
      fs.access(previewPath),
      fs.readdir(exportPath)
    ]);
    
    res.json({
      job_id,
      status: previewExists.status === 'fulfilled' ? 'completed' : 'processing',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Status check failed',
      message: error.message
    });
  }
});

export default router;