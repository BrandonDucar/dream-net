/**
 * Google Cloud SDK Client Integration
 * Direct Google Cloud integration - "jack it in" approach
 * Uses Google Cloud credentials (via GOOGLE_APPLICATION_CREDENTIALS or default credentials)
 */

import { ServicesClient } from '@google-cloud/run';
import { Storage } from '@google-cloud/storage';
import { CloudBuildClient } from '@google-cloud/cloudbuild';
import { CloudFunctionsServiceClient } from '@google-cloud/functions';
import { ProjectsClient } from '@google-cloud/resource-manager';

// Get project ID from environment or default
const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'dreamnet-62b49';
const region = process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';

// Google Cloud clients (use default credential chain - picks up GOOGLE_APPLICATION_CREDENTIALS or gcloud auth)
const cloudRunClient = new ServicesClient({
  projectId,
  // Credentials will be picked up from:
  // 1. GOOGLE_APPLICATION_CREDENTIALS env var (path to JSON key file)
  // 2. gcloud auth application-default login
  // 3. Google Cloud metadata server (if running on GCP)
});

const storageClient = new Storage({
  projectId,
});

const cloudBuildClient = new CloudBuildClient({
  projectId,
});

const functionsClient = new CloudFunctionsServiceClient({
  projectId,
});

const projectsClient = new ProjectsClient({
  projectId,
});

/**
 * Verify Google Cloud credentials and get project info
 */
export async function verifyGoogleCloudCredentials(): Promise<{
  projectId: string;
  projectNumber?: string;
  region: string;
}> {
  try {
    // Try to get project info
    const [project] = await projectsClient.getProject({
      name: `projects/${projectId}`,
    });

    return {
      projectId: projectId,
      projectNumber: project.name?.split('/')[1],
      region: region,
    };
  } catch (error: any) {
    // If project doesn't exist or credentials invalid, return basic info
    return {
      projectId: projectId,
      region: region,
    };
  }
}

/**
 * List Cloud Run services
 */
export async function listCloudRunServices(): Promise<any[]> {
  try {
    const parent = `projects/${projectId}/locations/${region}`;
    const [services] = await cloudRunClient.listServices({
      parent,
    });

    return services.map(service => ({
      name: service.name,
      serviceName: service.metadata?.name,
      url: service.status?.url,
      revision: service.status?.latestReadyRevisionName,
      traffic: service.status?.traffic,
      createdAt: service.metadata?.creationTimestamp,
    }));
  } catch (error: any) {
    throw new Error(`Failed to list Cloud Run services: ${error.message}`);
  }
}

/**
 * Get Cloud Run service by name
 */
export async function getCloudRunService(serviceName: string): Promise<any | null> {
  try {
    const name = `projects/${projectId}/locations/${region}/services/${serviceName}`;
    const [service] = await cloudRunClient.getService({
      name,
    });

    return {
      name: service.name,
      serviceName: service.metadata?.name,
      url: service.status?.url,
      revision: service.status?.latestReadyRevisionName,
      traffic: service.status?.traffic,
      createdAt: service.metadata?.creationTimestamp,
    };
  } catch (error: any) {
    if (error.code === 5) { // NOT_FOUND
      return null;
    }
    throw new Error(`Failed to get Cloud Run service: ${error.message}`);
  }
}

/**
 * Deploy to Cloud Run
 */
export async function deployToCloudRun(config: {
  serviceName: string;
  image: string;
  port?: number;
  environmentVariables?: Record<string, string>;
  memory?: string;
  cpu?: string;
  minInstances?: number;
  maxInstances?: number;
}): Promise<any> {
  try {
    const parent = `projects/${projectId}/locations/${region}`;
    const serviceName = `projects/${projectId}/locations/${region}/services/${config.serviceName}`;

    // Check if service exists
    let service;
    try {
      const [existingService] = await cloudRunClient.getService({
        name: serviceName,
      });
      service = existingService;
    } catch (error: any) {
      if (error.code === 5) { // NOT_FOUND - create new service
        service = null;
      } else {
        throw error;
      }
    }

    const containerEnv = Object.entries(config.environmentVariables || {}).map(([key, value]) => ({
      name: key,
      value: String(value),
    }));

    const serviceConfig = {
      template: {
        spec: {
          containers: [{
            image: config.image,
            ports: config.port ? [{ containerPort: config.port }] : [],
            env: containerEnv,
            resources: {
              limits: {
                memory: config.memory || '512Mi',
                cpu: config.cpu || '1',
              },
            },
          }],
        },
        metadata: {
          annotations: {
            'autoscaling.knative.dev/minScale': String(config.minInstances || 0),
            'autoscaling.knative.dev/maxScale': String(config.maxInstances || 100),
          },
        },
      },
    };

    if (service) {
      // Update existing service
      const [updatedService] = await cloudRunClient.updateService({
        service: {
          ...service,
          ...serviceConfig,
        },
      });

      return {
        name: updatedService.name,
        serviceName: updatedService.metadata?.name,
        url: updatedService.status?.url,
        revision: updatedService.status?.latestReadyRevisionName,
      };
    } else {
      // Create new service
      const [newService] = await cloudRunClient.createService({
        parent,
        service: {
          apiVersion: 'serving.knative.dev/v1',
          kind: 'Service',
          metadata: {
            name: config.serviceName,
          },
          ...serviceConfig,
        },
        serviceId: config.serviceName,
      });

      return {
        name: newService.name,
        serviceName: newService.metadata?.name,
        url: newService.status?.url,
        revision: newService.status?.latestReadyRevisionName,
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to deploy to Cloud Run: ${error.message}`);
  }
}

/**
 * List Cloud Storage buckets
 */
export async function listCloudStorageBuckets(): Promise<any[]> {
  try {
    const [buckets] = await storageClient.getBuckets();

    return buckets.map(bucket => ({
      name: bucket.name,
      location: bucket.metadata?.location,
      createdAt: bucket.metadata?.timeCreated,
      updatedAt: bucket.metadata?.updated,
    }));
  } catch (error: any) {
    throw new Error(`Failed to list Cloud Storage buckets: ${error.message}`);
  }
}

/**
 * Create Cloud Storage bucket
 */
export async function createCloudStorageBucket(bucketName: string, location?: string): Promise<any> {
  try {
    const [bucket] = await storageClient.createBucket(bucketName, {
      location: location || region,
      storageClass: 'STANDARD',
    });

    return {
      name: bucket.name,
      location: bucket.metadata?.location,
      createdAt: bucket.metadata?.timeCreated,
    };
  } catch (error: any) {
    throw new Error(`Failed to create Cloud Storage bucket: ${error.message}`);
  }
}

/**
 * Upload file to Cloud Storage
 */
export async function uploadToCloudStorage(config: {
  bucket: string;
  key: string;
  body: Buffer | string;
  contentType?: string;
  metadata?: Record<string, string>;
}): Promise<any> {
  try {
    const bucket = storageClient.bucket(config.bucket);
    const file = bucket.file(config.key);

    const buffer = typeof config.body === 'string' ? Buffer.from(config.body) : config.body;

    await file.save(buffer, {
      contentType: config.contentType || 'application/octet-stream',
      metadata: config.metadata,
    });

    // Make file publicly readable (optional)
    // await file.makePublic();

    return {
      bucket: config.bucket,
      key: config.key,
      publicUrl: `https://storage.googleapis.com/${config.bucket}/${config.key}`,
      gsUrl: `gs://${config.bucket}/${config.key}`,
    };
  } catch (error: any) {
    throw new Error(`Failed to upload to Cloud Storage: ${error.message}`);
  }
}

/**
 * List Cloud Build builds
 */
export async function listCloudBuildBuilds(limit: number = 10): Promise<any[]> {
  try {
    const parent = `projects/${projectId}/locations/${region}`;
    const [builds] = await cloudBuildClient.listBuilds({
      parent,
      pageSize: limit,
    });

    return builds.map(build => ({
      id: build.id,
      name: build.name,
      status: build.status,
      createTime: build.createTime,
      startTime: build.startTime,
      finishTime: build.finishTime,
      source: build.source,
      steps: build.steps,
    }));
  } catch (error: any) {
    throw new Error(`Failed to list Cloud Build builds: ${error.message}`);
  }
}

/**
 * Trigger Cloud Build
 */
export async function triggerCloudBuild(config: {
  source: {
    storageSource?: {
      bucket: string;
      object: string;
    };
    repoSource?: {
      repoName: string;
      branchName?: string;
      tagName?: string;
      commitSha?: string;
    };
  };
  steps: Array<{
    name: string;
    args: string[];
    env?: string[];
  }>;
  images?: string[];
  substitutions?: Record<string, string>;
}): Promise<any> {
  try {
    const parent = `projects/${projectId}/locations/${region}`;

    const build = {
      source: config.source,
      steps: config.steps,
      images: config.images || [],
      substitutions: config.substitutions,
    };

    const [operation] = await cloudBuildClient.createBuild({
      parent,
      build,
    });

    return {
      name: operation.name,
      metadata: operation.metadata,
    };
  } catch (error: any) {
    throw new Error(`Failed to trigger Cloud Build: ${error.message}`);
  }
}

/**
 * List Cloud Functions
 */
export async function listCloudFunctions(): Promise<any[]> {
  try {
    const parent = `projects/${projectId}/locations/${region}`;
    const [functions] = await functionsClient.listFunctions({
      parent,
    });

    return functions.map(func => ({
      name: func.name,
      functionName: func.name?.split('/').pop(),
      httpsTrigger: func.httpsTrigger,
      eventTrigger: func.eventTrigger,
      runtime: func.runtime,
      entryPoint: func.entryPoint,
      updateTime: func.updateTime,
      status: func.state,
    }));
  } catch (error: any) {
    throw new Error(`Failed to list Cloud Functions: ${error.message}`);
  }
}

/**
 * Deploy Cloud Function
 */
export async function deployCloudFunction(config: {
  functionName: string;
  runtime: string;
  entryPoint: string;
  sourceArchiveUrl?: string;
  sourceRepository?: {
    url: string;
    branch?: string;
  };
  httpsTrigger?: {
    securityLevel?: 'SECURE_ALWAYS' | 'SECURE_OPTIONAL';
  };
  eventTrigger?: {
    eventType: string;
    resource: string;
  };
  environmentVariables?: Record<string, string>;
  memory?: number;
  timeout?: string;
}): Promise<any> {
  try {
    const parent = `projects/${projectId}/locations/${region}`;
    const functionPath = `${parent}/functions/${config.functionName}`;

    // Check if function exists
    let existingFunction;
    try {
      const [func] = await functionsClient.getFunction({
        name: functionPath,
      });
      existingFunction = func;
    } catch (error: any) {
      if (error.code === 5) { // NOT_FOUND
        existingFunction = null;
      } else {
        throw error;
      }
    }

    const cloudFunction = {
      name: functionPath,
      runtime: config.runtime,
      entryPoint: config.entryPoint,
      sourceArchiveUrl: config.sourceArchiveUrl,
      sourceRepository: config.sourceRepository,
      httpsTrigger: config.httpsTrigger,
      eventTrigger: config.eventTrigger,
      environmentVariables: config.environmentVariables,
      availableMemoryMb: config.memory || 256,
      timeout: config.timeout || '60s',
    };

    if (existingFunction) {
      // Update existing function
      const [updatedFunction] = await functionsClient.updateFunction({
        function: {
          ...existingFunction,
          ...cloudFunction,
        },
        updateMask: {
          paths: [
            'runtime',
            'entryPoint',
            'sourceArchiveUrl',
            'sourceRepository',
            'httpsTrigger',
            'eventTrigger',
            'environmentVariables',
            'availableMemoryMb',
            'timeout',
          ],
        },
      });

      return {
        name: updatedFunction.name,
        functionName: updatedFunction.name?.split('/').pop(),
        httpsTrigger: updatedFunction.httpsTrigger,
        updateTime: updatedFunction.updateTime,
      };
    } else {
      // Create new function
      const [newFunction] = await functionsClient.createFunction({
        parent,
        function: cloudFunction,
        functionId: config.functionName,
      });

      return {
        name: newFunction.name,
        functionName: newFunction.name?.split('/').pop(),
        httpsTrigger: newFunction.httpsTrigger,
        updateTime: newFunction.updateTime,
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to deploy Cloud Function: ${error.message}`);
  }
}

