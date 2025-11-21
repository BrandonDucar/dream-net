# 🎯 AWS Policy Editor - Quick Guide

**You're Here**: IAM → Users → Dreamnet → Add Permissions → Policy Editor

---

## ✅ Easiest Way (Attach Existing Policies)

### Step 1: Click "Attach Policies Directly" (if not already selected)

### Step 2: In the Search Box, Type Each Service and Add:

**Storage & Compute**:
- Type: `S3` → Select: **AmazonS3FullAccess** ✅
- Type: `ECR` → Select: **AmazonEC2ContainerRegistryFullAccess** ✅
- Type: `App Runner` → Select: **AWSAppRunnerFullAccess** ✅
- Type: `Lambda` → Select: **AWSLambda_FullAccess** ✅
- Type: `Amplify` → Select: **AWSAmplifyFullAccess** ✅

**Databases**:
- Type: `RDS` → Select: **AmazonRDSFullAccess** ✅
- Type: `Redshift` → Select: **AmazonRedshiftFullAccess** ✅
- Type: `DynamoDB` → Select: **AmazonDynamoDBFullAccess** ✅
- Type: `ElastiCache` → Select: **AmazonElastiCacheFullAccess** ✅

**Messaging**:
- Type: `Kinesis` → Select: **AmazonKinesisFullAccess** ✅
- Type: `SQS` → Select: **AmazonSQSFullAccess** ✅
- Type: `EventBridge` → Select: **AmazonEventBridgeFullAccess** ✅

**Kubernetes**:
- Type: `EKS` → Select: **AmazonEKSClusterPolicy** ✅

**CDN**:
- Type: `CloudFront` → Select: **CloudFrontFullAccess** ✅

**Monitoring**:
- Type: `CloudWatch` → Select: **CloudWatchFullAccess** ✅

### Step 3: Click "Next" → "Add Permissions"

**Done!** ✅

---

## 🔧 Alternative: Custom JSON Policy

If you want to use the custom policy I created:

### Step 1: Click "Create Policy" (top right)

### Step 2: Select "JSON" Tab

### Step 3: Copy This JSON:

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
      "Action": ["eks:*"],
      "Resource": "*"
    },
    {
      "Sid": "IAMPassRole",
      "Effect": "Allow",
      "Action": ["iam:PassRole", "iam:GetRole", "iam:ListRoles"],
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

### Step 4: Click "Next" → Name: `DreamNetFullAccess` → "Create Policy"

### Step 5: Go Back to User → Add Permissions → Attach the Policy You Just Created

---

## 📋 Full Policy File

The complete policy is saved at: `infrastructure/aws/iam-policy.json`

You can copy the entire file contents and paste into the JSON editor.

---

## ✅ After Adding Policy

**Test**:
```bash
aws s3 ls
aws ecr describe-repositories --region us-east-1
```

**If these work, you're all set!** 🚀

---

**Recommendation**: Use the "Attach Policies Directly" method - it's faster and easier!

