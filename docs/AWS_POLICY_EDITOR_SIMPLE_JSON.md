# 📋 AWS Policy Editor - Simple JSON (What You Need)

**You're in**: Policy Editor → JSON Tab

---

## ✅ Option 1: Just the Policy Document (Most Likely What You Need)

**If the editor shows empty `Action: []` and `Resource: []`, replace with this:**

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
    "LambdaFullAccess",
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
      "Allow",
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

---

## ✅ Option 2: If Editor Shows CloudFormation Template

**If you see the CloudFormation structure, use this:**

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

## 🎯 Quick Steps

1. **In the JSON editor**, replace everything with one of the JSON blocks above
2. **Click "Next"** or "Review Policy"
3. **Name**: `DreamNetFullAccess`
4. **Click "Create Policy"**
5. **Go back to User** → Attach the policy

---

**File**: `infrastructure/aws/iam-policy-cloudformation.json` (full version)

