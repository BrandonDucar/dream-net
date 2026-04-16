/**
 * AWS SDK Client Integration
 * Direct AWS integration - "jack it in" approach
 * Uses your AWS credentials (already configured via AWS CLI)
 */

import {
  AmplifyClient,
  CreateAppCommand,
  CreateBranchCommand,
  StartDeploymentCommand,
  GetAppCommand,
  ListAppsCommand,
  type CreateAppCommandInput,
  type CreateBranchCommandInput,
} from '@aws-sdk/client-amplify';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  ListBucketsCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import {
  LambdaClient,
  CreateFunctionCommand,
  UpdateFunctionCodeCommand,
  ListFunctionsCommand,
  type CreateFunctionCommandInput,
} from '@aws-sdk/client-lambda';
import {
  STSClient,
  GetCallerIdentityCommand,
} from '@aws-sdk/client-sts';

// AWS SDK clients (use default credential chain - picks up AWS CLI config)
const amplifyClient = new AmplifyClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const stsClient = new STSClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * Verify AWS credentials and get account info
 */
export async function verifyAwsCredentials(): Promise<{
  account: string;
  arn: string;
  userId: string;
}> {
  try {
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    
    return {
      account: response.Account || 'unknown',
      arn: response.Arn || 'unknown',
      userId: response.UserId || 'unknown',
    };
  } catch (error: any) {
    throw new Error(`AWS credentials verification failed: ${error.message}`);
  }
}

/**
 * List all Amplify apps
 */
export async function listAmplifyApps(): Promise<any[]> {
  try {
    const command = new ListAppsCommand({});
    const response = await amplifyClient.send(command);
    return response.apps || [];
  } catch (error: any) {
    throw new Error(`Failed to list Amplify apps: ${error.message}`);
  }
}

/**
 * Get Amplify app by name
 */
export async function getAmplifyApp(appName: string): Promise<any | null> {
  try {
    const apps = await listAmplifyApps();
    return apps.find(app => app.name === appName) || null;
  } catch (error: any) {
    throw new Error(`Failed to get Amplify app: ${error.message}`);
  }
}

/**
 * Create Amplify app
 */
export async function createAmplifyApp(config: {
  name: string;
  description?: string;
  repository?: string;
  platform?: string;
  environmentVariables?: Record<string, string>;
}): Promise<any> {
  try {
    const input: CreateAppCommandInput = {
      name: config.name,
      description: config.description,
      platform: config.platform || 'WEB',
      environmentVariables: config.environmentVariables,
      // If repository provided, connect to GitHub
      repository: config.repository,
    };

    const command = new CreateAppCommand(input);
    const response = await amplifyClient.send(command);
    return response.app;
  } catch (error: any) {
    throw new Error(`Failed to create Amplify app: ${error.message}`);
  }
}

/**
 * Create Amplify branch
 */
export async function createAmplifyBranch(config: {
  appId: string;
  branchName: string;
  framework?: string;
}): Promise<any> {
  try {
    const input: CreateBranchCommandInput = {
      appId: config.appId,
      branchName: config.branchName,
      framework: config.framework || 'React',
    };

    const command = new CreateBranchCommand(input);
    const response = await amplifyClient.send(command);
    return response.branch;
  } catch (error: any) {
    throw new Error(`Failed to create Amplify branch: ${error.message}`);
  }
}

/**
 * Deploy to Amplify
 */
export async function deployToAmplify(config: {
  appId: string;
  branchName: string;
}): Promise<any> {
  try {
    const command = new StartDeploymentCommand({
      appId: config.appId,
      branchName: config.branchName,
    });
    const response = await amplifyClient.send(command);
    return response.jobSummary;
  } catch (error: any) {
    throw new Error(`Failed to deploy to Amplify: ${error.message}`);
  }
}

/**
 * List S3 buckets
 */
export async function listS3Buckets(): Promise<any[]> {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    return response.Buckets || [];
  } catch (error: any) {
    throw new Error(`Failed to list S3 buckets: ${error.message}`);
  }
}

/**
 * Create S3 bucket
 */
export async function createS3Bucket(bucketName: string, region?: string): Promise<any> {
  try {
    const command = new CreateBucketCommand({
      Bucket: bucketName,
      ...(region && { CreateBucketConfiguration: { LocationConstraint: region } }),
    });
    const response = await s3Client.send(command);
    return { bucketName, location: response.Location };
  } catch (error: any) {
    throw new Error(`Failed to create S3 bucket: ${error.message}`);
  }
}

/**
 * Upload file to S3
 */
export async function uploadToS3(config: {
  bucket: string;
  key: string;
  body: Buffer | string;
  contentType?: string;
}): Promise<any> {
  try {
    const input: PutObjectCommandInput = {
      Bucket: config.bucket,
      Key: config.key,
      Body: typeof config.body === 'string' ? Buffer.from(config.body) : config.body,
      ContentType: config.contentType || 'application/octet-stream',
    };

    const command = new PutObjectCommand(input);
    const response = await s3Client.send(command);
    return {
      bucket: config.bucket,
      key: config.key,
      etag: response.ETag,
      location: `https://${config.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${config.key}`,
    };
  } catch (error: any) {
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
}

/**
 * List Lambda functions
 */
export async function listLambdaFunctions(): Promise<any[]> {
  try {
    const command = new ListFunctionsCommand({});
    const response = await lambdaClient.send(command);
    return response.Functions || [];
  } catch (error: any) {
    throw new Error(`Failed to list Lambda functions: ${error.message}`);
  }
}

/**
 * Create Lambda function
 */
export async function createLambdaFunction(config: {
  functionName: string;
  runtime: string;
  role: string;
  handler: string;
  code: Buffer | string;
  environment?: Record<string, string>;
}): Promise<any> {
  try {
    const input: CreateFunctionCommandInput = {
      FunctionName: config.functionName,
      Runtime: config.runtime,
      Role: config.role,
      Handler: config.handler,
      Code: {
        ZipFile: typeof config.code === 'string' ? Buffer.from(config.code) : config.code,
      },
      Environment: config.environment ? { Variables: config.environment } : undefined,
    };

    const command = new CreateFunctionCommand(input);
    const response = await lambdaClient.send(command);
    return response;
  } catch (error: any) {
    throw new Error(`Failed to create Lambda function: ${error.message}`);
  }
}

/**
 * Update Lambda function code
 */
export async function updateLambdaCode(config: {
  functionName: string;
  code: Buffer | string;
}): Promise<any> {
  try {
    const command = new UpdateFunctionCodeCommand({
      FunctionName: config.functionName,
      ZipFile: typeof config.code === 'string' ? Buffer.from(config.code) : config.code,
    });
    const response = await lambdaClient.send(command);
    return response;
  } catch (error: any) {
    throw new Error(`Failed to update Lambda code: ${error.message}`);
  }
}

