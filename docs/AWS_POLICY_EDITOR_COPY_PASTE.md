# 📋 AWS Policy Editor - Copy & Paste

**You're in**: Policy Editor → JSON Tab

---

## ✅ Copy This Entire JSON

Replace everything in the editor with this:

```json
{
  "Type": "AWS::IAM::Policy",
  "Properties": {
    "PolicyName": "DreamNetFullAccess",
    "PolicyDocument": {
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
  }
}
```

---

## 🎯 Steps

1. **Select "JSON" tab** in policy editor
2. **Delete** the existing template
3. **Paste** the JSON above
4. **Click "Next"** or "Review Policy"
5. **Name it**: `DreamNetFullAccess`
6. **Click "Create Policy"**
7. **Go back to User** → Add Permissions → Attach the policy you just created

---

## ✅ What This Enables

- ✅ S3 (storage)
- ✅ ECR (container registry)
- ✅ App Runner (serverless containers)
- ✅ CloudFront (CDN)
- ✅ Lambda (serverless functions)
- ✅ Amplify (frontend hosting)
- ✅ RDS (PostgreSQL)
- ✅ Redshift (data warehouse)
- ✅ DynamoDB (NoSQL)
- ✅ ElastiCache (Redis)
- ✅ Kinesis (streaming)
- ✅ SQS (queues)
- ✅ EventBridge (events)
- ✅ EKS (Kubernetes)
- ✅ CloudWatch (monitoring)

---

**File Saved**: `infrastructure/aws/iam-policy-cloudformation.json`

