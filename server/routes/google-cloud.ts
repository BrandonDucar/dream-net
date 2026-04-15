/**
 * Google Cloud Integration API Routes
 * Direct Google Cloud SDK integration - "jack it in" approach
 */

import { Router } from 'express';
import {
  verifyGoogleCloudCredentials,
  listCloudRunServices,
  getCloudRunService,
  deployToCloudRun,
  listCloudStorageBuckets,
  createCloudStorageBucket,
  uploadToCloudStorage,
  listCloudBuildBuilds,
  triggerCloudBuild,
  listCloudFunctions,
  deployCloudFunction,
} from '../integrations/googleCloudClient';

const router = Router();

/**
 * GET /api/google-cloud/status
 * Verify Google Cloud credentials and get project info
 */
router.get('/status', async (req, res) => {
  try {
    const projectInfo = await verifyGoogleCloudCredentials();

    res.json({
      success: true,
      project: projectInfo,
      region: process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1',
      message: 'Google Cloud credentials verified',
    });
  } catch (error: any) {
    console.error('[Google Cloud] Status check failed:', error);
    res.status(500).json({
      error: 'Failed to verify Google Cloud credentials',
      message: error.message,
    });
  }
});

/**
 * GET /api/google-cloud/run/services
 * List all Cloud Run services
 */
router.get('/run/services', async (req, res) => {
  try {
    const services = await listCloudRunServices();

    res.json({
      success: true,
      services,
      count: services.length,
    });
  } catch (error: any) {
    console.error('[Google Cloud] List services failed:', error);
    res.status(500).json({
      error: 'Failed to list Cloud Run services',
      message: error.message,
    });
  }
});

/**
 * GET /api/google-cloud/run/services/:name
 * Get Cloud Run service by name
 */
router.get('/run/services/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const service = await getCloudRunService(name);

    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        serviceName: name,
      });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error: any) {
    console.error('[Google Cloud] Get service failed:', error);
    res.status(500).json({
      error: 'Failed to get Cloud Run service',
      message: error.message,
    });
  }
});

/**
 * POST /api/google-cloud/run/deploy
 * Deploy to Cloud Run
 */
router.post('/run/deploy', async (req, res) => {
  try {
    const {
      serviceName,
      image,
      port,
      environmentVariables,
      memory,
      cpu,
      minInstances,
      maxInstances,
    } = req.body;

    if (!serviceName || !image) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['serviceName', 'image'],
      });
    }

    const result = await deployToCloudRun({
      serviceName,
      image,
      port,
      environmentVariables,
      memory,
      cpu,
      minInstances,
      maxInstances,
    });

    res.json({
      success: true,
      service: result,
      message: 'Deployed to Cloud Run successfully',
    });
  } catch (error: any) {
    console.error('[Google Cloud] Deploy failed:', error);
    res.status(500).json({
      error: 'Failed to deploy to Cloud Run',
      message: error.message,
    });
  }
});

/**
 * GET /api/google-cloud/storage/buckets
 * List all Cloud Storage buckets
 */
router.get('/storage/buckets', async (req, res) => {
  try {
    const buckets = await listCloudStorageBuckets();

    res.json({
      success: true,
      buckets,
      count: buckets.length,
    });
  } catch (error: any) {
    console.error('[Google Cloud] List buckets failed:', error);
    res.status(500).json({
      error: 'Failed to list Cloud Storage buckets',
      message: error.message,
    });
  }
});

/**
 * POST /api/google-cloud/storage/buckets
 * Create Cloud Storage bucket
 */
router.post('/storage/buckets', async (req, res) => {
  try {
    const { bucketName, location } = req.body;

    if (!bucketName) {
      return res.status(400).json({
        error: 'Missing required field',
        required: ['bucketName'],
      });
    }

    const result = await createCloudStorageBucket(bucketName, location);

    res.json({
      success: true,
      bucket: result,
      message: 'Cloud Storage bucket created successfully',
    });
  } catch (error: any) {
    console.error('[Google Cloud] Create bucket failed:', error);
    res.status(500).json({
      error: 'Failed to create Cloud Storage bucket',
      message: error.message,
    });
  }
});

/**
 * POST /api/google-cloud/storage/upload
 * Upload file to Cloud Storage
 */
router.post('/storage/upload', async (req, res) => {
  try {
    const { bucket, key, body, contentType, metadata } = req.body;

    if (!bucket || !key || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['bucket', 'key', 'body'],
      });
    }

    const result = await uploadToCloudStorage({
      bucket,
      key,
      body: Buffer.from(body, 'base64'), // Expect base64 encoded body
      contentType,
      metadata,
    });

    res.json({
      success: true,
      file: result,
      message: 'File uploaded to Cloud Storage successfully',
    });
  } catch (error: any) {
    console.error('[Google Cloud] Upload failed:', error);
    res.status(500).json({
      error: 'Failed to upload to Cloud Storage',
      message: error.message,
    });
  }
});

/**
 * GET /api/google-cloud/build/builds
 * List Cloud Build builds
 */
router.get('/build/builds', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const builds = await listCloudBuildBuilds(limit);

    res.json({
      success: true,
      builds,
      count: builds.length,
    });
  } catch (error: any) {
    console.error('[Google Cloud] List builds failed:', error);
    res.status(500).json({
      error: 'Failed to list Cloud Build builds',
      message: error.message,
    });
  }
});

/**
 * POST /api/google-cloud/build/trigger
 * Trigger Cloud Build
 */
router.post('/build/trigger', async (req, res) => {
  try {
    const { source, steps, images, substitutions } = req.body;

    if (!source || !steps) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['source', 'steps'],
      });
    }

    const result = await triggerCloudBuild({
      source,
      steps,
      images,
      substitutions,
    });

    res.json({
      success: true,
      build: result,
      message: 'Cloud Build triggered successfully',
    });
  } catch (error: any) {
    console.error('[Google Cloud] Trigger build failed:', error);
    res.status(500).json({
      error: 'Failed to trigger Cloud Build',
      message: error.message,
    });
  }
});

/**
 * GET /api/google-cloud/functions
 * List Cloud Functions
 */
router.get('/functions', async (req, res) => {
  try {
    const functions = await listCloudFunctions();

    res.json({
      success: true,
      functions,
      count: functions.length,
    });
  } catch (error: any) {
    console.error('[Google Cloud] List functions failed:', error);
    res.status(500).json({
      error: 'Failed to list Cloud Functions',
      message: error.message,
    });
  }
});

/**
 * POST /api/google-cloud/functions
 * Deploy Cloud Function
 */
router.post('/functions', async (req, res) => {
  try {
    const {
      functionName,
      runtime,
      entryPoint,
      sourceArchiveUrl,
      sourceRepository,
      httpsTrigger,
      eventTrigger,
      environmentVariables,
      memory,
      timeout,
    } = req.body;

    if (!functionName || !runtime || !entryPoint) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['functionName', 'runtime', 'entryPoint'],
      });
    }

    const result = await deployCloudFunction({
      functionName,
      runtime,
      entryPoint,
      sourceArchiveUrl,
      sourceRepository,
      httpsTrigger,
      eventTrigger,
      environmentVariables,
      memory,
      timeout,
    });

    res.json({
      success: true,
      function: result,
      message: 'Cloud Function deployed successfully',
    });
  } catch (error: any) {
    console.error('[Google Cloud] Deploy function failed:', error);
    res.status(500).json({
      error: 'Failed to deploy Cloud Function',
      message: error.message,
    });
  }
});

export default router;

