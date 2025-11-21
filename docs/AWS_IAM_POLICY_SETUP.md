# 🔐 AWS IAM Policy Setup Guide

**Date**: 2025-01-27  
**User**: Dreamnet  
**Account**: 001092882186

---

## 📋 Quick Setup (Policy Editor)

### Option 1: Use Pre-Built Policy (Easiest)

1. **In AWS Console** → IAM → Users → Dreamnet → Add Permissions
2. **Select**: "Attach Policies Directly"
3. **Search and Add These Policies**:
   - ✅ `AmazonS3FullAccess`
   - ✅ `AmazonEC2ContainerRegistryFullAccess`
   - ✅ `AWSAppRunnerFullAccess`
   - ✅ `CloudFrontFullAccess`
   - ✅ `AWSLambda_FullAccess`
   - ✅ `AWSAmplifyFullAccess`
   - ✅ `AmazonRDSFullAccess`
   - ✅ `AmazonRedshiftFullAccess`
   - ✅ `AmazonDynamoDBFullAccess`
   - ✅ `AmazonElastiCacheFullAccess`
   - ✅ `AmazonKinesisFullAccess`
   - ✅ `AmazonSQSFullAccess`
   - ✅ `AmazonEventBridgeFullAccess`
   - ✅ `AmazonEKSClusterPolicy`
   - ✅ `CloudWatchFullAccess`

**Click "Next" → "Add Permissions"**

---

### Option 2: Custom Policy (More Secure)

1. **In Policy Editor** → Select "JSON" tab
2. **Copy the policy from**: `infrastructure/aws/iam-policy.json`
3. **Paste it into the JSON editor**
4. **Click "Next"** → **Name it**: `DreamNetFullAccess`
5. **Click "Create Policy"**
6. **Then attach it to user**: Dreamnet

---

## 📝 Policy JSON (Copy This)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3FullAccess",
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": "*"
    },
    {
      "Sid": "ECRFullAccess",
      "Effect": "Allow",
      "Action": ["ecr:*"],
      "Resource": "*"
    },
    {
      "Sid": "AppRunnerFullAccess",
      "Effect": "Allow",
      "Action": ["apprunner:*"],
      "Resource": "*"
    },
    {
      "Sid": "CloudFrontFullAccess",
      "Effect": "Allow",
      "Action": ["cloudfront:*"],
      "Resource": "*"
    },
    {
      "Sid": "LambdaFullAccess",
      "Effect": "Allow",
      "Action": ["lambda:*"],
      "Resource": "*"
    },
    {
      "Sid": "AmplifyFullAccess",
      "Effect": "Allow",
      "Action": ["amplify:*"],
      "Resource": "*"
    },
    {
      "Sid": "RDSFullAccess",
      "Effect": "Allow",
      "Action": ["rds:*"],
      "Resource": "*"
    },
    {
      "Sid": "RedshiftFullAccess",
      "Effect": "Allow",
      "Action": ["redshift:*"],
      "Resource": "*"
    },
    {
      "Sid": "DynamoDBFullAccess",
      "Effect": "Allow",
      "Action": ["dynamodb:*"],
      "Resource": "*"
    },
    {
      "Sid": "ElastiCacheFullAccess",
      "Effect": "Allow",
      "Action": ["elasticache:*"],
      "Resource": "*"
    },
    {
      "Sid": "KinesisFullAccess",
      "Effect": "Allow",
      "Action": ["kinesis:*"],
      "Resource": "*"
    },
    {
      "Sid": "SQSFullAccess",
      "Effect": "Allow",
      "Action": ["sqs:*"],
      "Resource": "*"
    },
    {
      "Sid": "EventBridgeFullAccess",
      "Effect": "Allow",
      "Action": ["events:*"],
      "Resource": "*"
    },
    {
      "Sid": "EKSAccess",
      "Effect": "Allow",
      "Action": [
        "eks:*",
        "eks:DescribeCluster",
        "eks:ListClusters",
        "eks:CreateCluster",
        "eks:UpdateCluster",
        "eks:DeleteCluster"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPassRole",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "iam:GetRole",
        "iam:ListRoles"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EC2ForEKS",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogs",
      "Effect": "Allow",
      "Action": ["logs:*"],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchMetrics",
      "Effect": "Allow",
      "Action": ["cloudwatch:*"],
      "Resource": "*"
    }
  ]
}
```

---

## 🎯 What This Policy Enables

### Storage & Compute
- ✅ **S3** - Object storage, static hosting
- ✅ **ECR** - Container registry
- ✅ **App Runner** - Serverless containers
- ✅ **Lambda** - Serverless functions
- ✅ **Amplify** - Frontend hosting

### Databases & Data
- ✅ **RDS** - Managed PostgreSQL
- ✅ **Redshift** - Data warehouse
- ✅ **DynamoDB** - NoSQL database
- ✅ **ElastiCache** - Redis cache

### Messaging & Events
- ✅ **Kinesis** - Stream processing
- ✅ **SQS** - Message queues
- ✅ **EventBridge** - Event bus

### Kubernetes
- ✅ **EKS** - Managed Kubernetes
- ✅ **EC2** - For EKS node groups

### CDN & Networking
- ✅ **CloudFront** - CDN

### Monitoring
- ✅ **CloudWatch** - Logs and metrics

---

## ✅ After Adding Policy

**Test Permissions**:
```bash
aws s3 ls
aws ecr describe-repositories --region us-east-1
aws apprunner list-services --region us-east-1
```

**If all work, you're ready to deploy!** 🚀

---

**Direct Link**: https://console.aws.amazon.com/iam/home#/users/Dreamnet  
**Policy File**: `infrastructure/aws/iam-policy.json`

