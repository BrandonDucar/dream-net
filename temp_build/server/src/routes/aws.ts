/**
 * AWS Integration API Routes
 * Direct AWS SDK integration - "jack it in" approach
 */

import { Router } from 'express';
import {
  verifyAwsCredentials,
  listAmplifyApps,
  getAmplifyApp,
  createAmplifyApp,
  createAmplifyBranch,
  deployToAmplify,
  listS3Buckets,
  createS3Bucket,
  uploadToS3,
  listLambdaFunctions,
  createLambdaFunction,
  updateLambdaCode,
} from '../integrations/awsClient';
import fs from 'fs';
import path from 'path';

const router = Router();

/**
 * GET /api/aws/status
 * Verify AWS credentials and get account info
 */
router.get('/status', async (req, res) => {
  try {
    const identity = await verifyAwsCredentials();
    res.json({
      success: true,
      account: identity.account,
      arn: identity.arn,
      userId: identity.userId,
      region: process.env.AWS_REGION || 'us-east-1',
      message: 'AWS credentials verified',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to verify AWS credentials',
      message: error.message,
    });
  }
});

/**
 * GET /api/aws/amplify/apps
 * List all Amplify apps
 */
router.get('/amplify/apps', async (req, res) => {
  try {
    const apps = await listAmplifyApps();
    res.json({
      success: true,
      apps,
      count: apps.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to list Amplify apps',
      message: error.message,
    });
  }
});

/**
 * GET /api/aws/amplify/apps/:name
 * Get Amplify app by name
 */
router.get('/amplify/apps/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const app = await getAmplifyApp(name);
    
    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'Amplify app not found',
        name,
      });
    }
    
    res.json({
      success: true,
      app,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get Amplify app',
      message: error.message,
    });
  }
});

/**
 * POST /api/aws/amplify/apps
 * Create Amplify app
 */
router.post('/amplify/apps', async (req, res) => {
  try {
    const { name, description, repository, platform, environmentVariables } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: name',
      });
    }
    
    const app = await createAmplifyApp({
      name,
      description,
      repository,
      platform,
      environmentVariables,
    });
    
    res.json({
      success: true,
      app,
      message: `Amplify app "${name}" created successfully`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Failed to create Amplify app',
      message: error.message,
    });
  }
});

/**
 * POST /api/aws/amplify/deploy
 * Deploy to Amplify
 */
router.post('/amplify/deploy', async (req, res) => {
  try {
    const { appId, branchName } = req.body;
    
    if (!appId || !branchName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: appId, branchName',
      });
    }
    
    const deployment = await deployToAmplify({ appId, branchName });
    
    res.json({
      success: true,
      deployment,
      message: `Deployment started for ${branchName}`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Failed to deploy to Amplify',
      message: error.message,
    });
  }
});

/**
 * GET /api/aws/s3/buckets
 * List S3 buckets
 */
router.get('/s3/buckets', async (req, res) => {
  try {
    const buckets = await listS3Buckets();
    res.json({
      success: true,
      buckets,
      count: buckets.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to list S3 buckets',
      message: error.message,
    });
  }
});

/**
 * POST /api/aws/s3/buckets
 * Create S3 bucket
 */
router.post('/s3/buckets', async (req, res) => {
  try {
    const { bucketName, region } = req.body;
    
    if (!bucketName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: bucketName',
      });
    }
    
    const result = await createS3Bucket(bucketName, region);
    
    res.json({
      success: true,
      ...result,
      message: `S3 bucket "${bucketName}" created successfully`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Failed to create S3 bucket',
      message: error.message,
    });
  }
});

/**
 * POST /api/aws/s3/upload
 * Upload file to S3
 */
router.post('/s3/upload', async (req, res) => {
  try {
    const { bucket, key, filePath, contentType } = req.body;
    
    if (!bucket || !key) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bucket, key',
      });
    }
    
    // Read file if filePath provided, otherwise expect body in request
    let fileBody: Buffer;
    if (filePath) {
      const fullPath = path.resolve(filePath);
      if (!fs.existsSync(fullPath)) {
        return res.status(400).json({
          success: false,
          error: 'File not found',
          filePath: fullPath,
        });
      }
      fileBody = fs.readFileSync(fullPath);
    } else {
      // Expect file content in request body (for small files)
      fileBody = Buffer.from(req.body.content || '');
    }
    
    const result = await uploadToS3({
      bucket,
      key,
      body: fileBody,
      contentType: contentType || 'application/octet-stream',
    });
    
    res.json({
      success: true,
      ...result,
      message: `File uploaded to S3: ${key}`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Failed to upload to S3',
      message: error.message,
    });
  }
});

/**
 * GET /api/aws/lambda/functions
 * List Lambda functions
 */
router.get('/lambda/functions', async (req, res) => {
  try {
    const functions = await listLambdaFunctions();
    res.json({
      success: true,
      functions,
      count: functions.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to list Lambda functions',
      message: error.message,
    });
  }
});

/**
 * POST /api/aws/lambda/functions
 * Create Lambda function
 */
router.post('/lambda/functions', async (req, res) => {
  try {
    const { functionName, runtime, role, handler, code, environment } = req.body;
    
    if (!functionName || !runtime || !role || !handler || !code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: functionName, runtime, role, handler, code',
      });
    }
    
    const func = await createLambdaFunction({
      functionName,
      runtime,
      role,
      handler,
      code: Buffer.from(code),
      environment,
    });
    
    res.json({
      success: true,
      function: func,
      message: `Lambda function "${functionName}" created successfully`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Failed to create Lambda function',
      message: error.message,
    });
  }
});

export default router;

