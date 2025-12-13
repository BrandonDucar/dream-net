# DreamNet Secrets Management Guide

**Last Updated**: 2025-01-27  
**Owner**: DreamOps Team

---

## Overview

DreamNet uses environment variables for secrets management. In production, use cloud provider secret managers (GCP Secret Manager, AWS Secrets Manager) instead of `.env` files.

---

## Secret Storage Locations

### Development
- **File**: `.env` (gitignored)
- **Format**: `KEY=value` (one per line)
- **Never commit**: `.env` files should never be committed to git

### Production - GCP
- **Service**: Google Cloud Secret Manager
- **Access**: Via `GOOGLE_APPLICATION_CREDENTIALS` or service account
- **Format**: Individual secrets per key
- **Rotation**: Manual or automated via Cloud Scheduler

### Production - AWS
- **Service**: AWS Secrets Manager
- **Access**: Via IAM roles
- **Format**: JSON secrets or individual secrets
- **Rotation**: Manual or automated via Lambda

---

## Secret Categories

### API Keys (External Services)
- `OPENAI_API_KEY` - OpenAI API access
- `ANTHROPIC_API_KEY` - Anthropic API access
- `STRIPE_SECRET_KEY` - Stripe payments
- `TWILIO_AUTH_TOKEN` - Twilio SMS/voice
- `GOOGLE_CLIENT_SECRET` - Google OAuth

### Database
- `DATABASE_URL` - PostgreSQL connection string
- Format: `postgresql://user:password@host:port/database`

### Cloud Provider Credentials
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to GCP service account JSON
- AWS credentials: Via `~/.aws/credentials` or IAM roles

### Internal Secrets
- `DREAMNET_API_KEY` - Internal API authentication
- `ADMIN_TOKEN` - Admin operations token
- `HMAC_SECRET` - HMAC signing secret

---

## Rotation Policy

### High-Risk Secrets (Rotate Monthly)
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `DATABASE_URL` (password component)
- `ADMIN_TOKEN`

### Medium-Risk Secrets (Rotate Quarterly)
- `TWILIO_AUTH_TOKEN`
- `GOOGLE_CLIENT_SECRET`
- `DREAMNET_API_KEY`

### Low-Risk Secrets (Rotate Annually)
- `HMAC_SECRET` (if not used for critical operations)

---

## Rotation Procedure

### 1. Generate New Secret
```bash
# Generate secure random string
openssl rand -hex 32
```

### 2. Update Secret
**GCP**:
```bash
# Create new secret version
gcloud secrets versions add SECRET_NAME --data-file=-

# Update Cloud Run service
gcloud run services update dreamnet \
  --update-secrets SECRET_NAME=SECRET_NAME:latest \
  --region us-central1
```

**AWS**:
```bash
# Update secret
aws secretsmanager update-secret \
  --secret-id SECRET_NAME \
  --secret-string '{"key": "new-value"}'

# Restart App Runner service (picks up new secret)
```

### 3. Verify
- Check service logs for errors
- Verify functionality works with new secret
- Monitor for 24 hours

### 4. Deprecate Old Secret
- Keep old secret for 7 days (rollback window)
- Delete old secret version after verification

---

## Commit-Scoped Notes

When rotating secrets, document in deployment notes:
- **Date**: YYYY-MM-DD
- **Secret**: Which secret was rotated
- **Commit**: Git commit hash of deployment
- **Reason**: Why rotation was needed
- **Rollback**: How to rollback if needed

---

## Emergency Secret Rotation

If a secret is compromised:

1. **Immediately rotate** (don't wait for maintenance window)
2. **Enable safe mode** (`SAFE_MODE=on`)
3. **Rotate secret** (follow procedure above)
4. **Restart service**
5. **Monitor** for 1 hour
6. **Disable safe mode** once verified

---

## Secret Access Control

### Development
- Only developers with repo access
- Stored in `.env` (gitignored)
- Never shared via Slack/email

### Production
- **GCP**: Service account with Secret Manager access
- **AWS**: IAM role with Secrets Manager access
- **Principle**: Least privilege (only services that need it)

---

## Audit Trail

All secret access should be logged:
- Who accessed (service account/user)
- When accessed
- Which secret
- Purpose (if applicable)

**GCP**: Cloud Audit Logs  
**AWS**: CloudTrail

---

## Best Practices

1. **Never commit secrets** to git
2. **Use secret managers** in production (not `.env` files)
3. **Rotate regularly** (follow rotation policy)
4. **Use different secrets** for dev/staging/prod
5. **Monitor access** (audit logs)
6. **Document rotations** (commit-scoped notes)
7. **Test rollback** procedure before rotation

---

## Troubleshooting

### Secret Not Found
- Check secret name matches exactly
- Verify service account/IAM role has access
- Check secret exists in secret manager

### Secret Access Denied
- Verify IAM permissions
- Check service account is correct
- Verify secret manager API is enabled

### Secret Format Error
- Check JSON format (if using JSON secrets)
- Verify no extra whitespace
- Check encoding (UTF-8)

---

## Contacts

- **Secrets Admin**: [Contact]
- **Security Team**: [Contact]
- **Escalation**: [PagerDuty]

---

**Remember**: Secrets are sensitive. Treat them with care.

