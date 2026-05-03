# Security Policy

## Reporting

Report DreamNet security issues privately to the project owner. Do not open public issues containing secrets, API keys, database URLs, wallet material, or exploitable details.

## Secret Handling

- Do not commit `.env`, `.env.*`, private keys, wallet mnemonics, API keys, or provider tokens.
- Use ignored local env files for development and platform secret stores for deployments.
- Rotate any credential that appears in chat, logs, screenshots, commits, or CI output.
- Treat agent credentials as per-agent capabilities, not shared global powers.

## Agent Runtime Rules

- External actions must pass through policy, budget, rate-limit, and capability checks.
- Wallet, email, filesystem-write, and outbound network actions require preflight and audit records.
- Production mutations should produce signed artifacts with a rollback path.

## Immediate Rotation Checklist

1. Revoke the exposed key at the provider.
2. Issue a replacement key with the narrowest available scope.
3. Update local/platform secrets without printing the value in logs.
4. Search git history and CI logs for remaining exposure.
5. Document the rotation in a private incident note.
