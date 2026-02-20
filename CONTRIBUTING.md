# 🤝 Contributing to DreamNet

Thank you for your interest in contributing to DreamNet! We welcome contributions from the community.

---

## 📋 Before You Start

Please read our [LICENSE](./LICENSE) (BUSL-1.1). Key points:

- ✅ You can fork and modify the code freely
- ✅ You can use it in non-production environments
- ✅ Your contributions will be under the same BUSL-1.1 license
- ⚠️ Production use requires a commercial license from us

If you have any license questions, email: contact@dreamnet.ink

---

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Go to https://github.com/BrandonDucar/dream-net
# Click "Fork" in the top-right corner
```

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/dream-net.git
cd dream-net
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/BrandonDucar/dream-net.git
git fetch upstream
```

### 4. Create a Feature Branch

```bash
# Create branch from latest upstream main
git checkout -b feature/your-feature-name upstream/main

# Or for bug fixes
git checkout -b fix/your-bug-fix-name upstream/main
```

---

## 🔨 Development Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your settings
# (For development, most are optional)

# Start the development environment
docker-compose up -d

# Verify all services are running
docker-compose ps
```

### Development Commands

```bash
# Run tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build
pnpm build

# Start development server (if applicable)
pnpm dev
```

---

## 📝 Contribution Guidelines

### Code Style

- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **Formatting**: Prettier (auto-format on commit)
- **Linting**: ESLint (run before commit)
- **Naming**: camelCase for variables/functions, PascalCase for classes/types

### Commits

Write clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: add bytecode compiler for agent injection"
git commit -m "fix: resolve NATS connection timeout on startup"
git commit -m "docs: update OpenClaw Injector implementation guide"

# Bad
git commit -m "update"
git commit -m "WIP"
git commit -m "fix stuff"
```

### Branch Naming

```
feature/your-feature-name      # New features
fix/your-bug-fix-name          # Bug fixes
docs/your-documentation-name   # Documentation
refactor/your-refactor-name    # Code refactoring
test/your-test-name            # Tests
```

---

## 🎯 What We Need Help With

### High Priority

#### 🔧 OpenClaw Injector (Port 7005)
**Status**: Design complete, implementation started  
**Difficulty**: Medium  
**Skills**: TypeScript, Docker API, bytecode compilation  

Help build the dynamic code injection system:
- [ ] Complete `compiler/bytecode-generator.ts`
- [ ] Implement `injector/volume-injector.ts`
- [ ] Build `tracer/execution-tracer.ts`
- [ ] Add comprehensive tests
- [ ] Documentation & examples

**Files**: `packages/organs/endocrine/openclaw-injector/`

#### 🎓 Starfleet Academy Curriculum (Port 7004)
**Status**: Framework exists, curriculum needed  
**Difficulty**: Medium  
**Skills**: TypeScript, course design, agent theory  

Build specialized training programs:
- [ ] Command School curriculum (8 weeks)
- [ ] Engineering School curriculum (8 weeks)
- [ ] Science School curriculum (8 weeks)
- [ ] Operations School curriculum (8 weeks)
- [ ] Security School curriculum (8 weeks)

**Files**: `packages/organs/neural/academy/`

#### 🌐 Replit Website Dashboard (Frontend)
**Status**: Skeleton exists, features needed  
**Difficulty**: Easy-Medium  
**Skills**: React, TypeScript, WebSocket, real-time data  

Build the live monitoring dashboard:
- [ ] Live agent roster
- [ ] Real-time operation progress
- [ ] Agent performance leaderboards
- [ ] Cost savings metrics
- [ ] P.O.W.K. reward distribution visualization
- [ ] Governor decision traces

**Files**: `packages/client/` (Replit deployment)

#### 🎮 Neynar/Farcaster Frames (Smart Contracts + Frontend)
**Status**: Design complete, implementation needed  
**Difficulty**: Medium-Hard  
**Skills**: TypeScript, Farcaster API, smart contracts (optional)  

Build interactive Farcaster frames:
- [ ] Commission agent frame
- [ ] Enroll in Academy frame
- [ ] View leaderboard frame
- [ ] Receive rewards frame
- [ ] Tip agent frame

**Files**: `packages/frames/` (new)

### Medium Priority

#### ☸️ Kubernetes Migration
**Status**: Manifests created, testing needed  
**Difficulty**: Medium-Hard  
**Skills**: Kubernetes, Docker, DevOps  

Scale from Docker Compose to Kubernetes:
- [ ] Provision K8s cluster (AWS EKS or GCP GKE)
- [ ] Migrate services (one by one)
- [ ] Set up auto-scaling
- [ ] Implement multi-region failover
- [ ] Performance testing at scale

**Files**: `packages/kubernetes/`

#### 📊 Analytics & Monitoring
**Status**: Basic metrics exist, advanced analytics needed  
**Difficulty**: Medium  
**Skills**: TypeScript, time-series databases, visualization  

Enhance performance tracking:
- [ ] Agent performance metrics
- [ ] Cost/benefit analysis
- [ ] Historical trend analysis
- [ ] Anomaly detection
- [ ] Performance leaderboards

**Files**: `packages/organs/integumentary/analytics/`

#### 🔐 Security Hardening
**Status**: Basic security in place, advanced hardening needed  
**Difficulty**: Hard  
**Skills**: Security, Docker, Linux, threat modeling  

Improve security posture:
- [ ] Penetration testing
- [ ] Threat modeling
- [ ] Container escape testing
- [ ] Network policy validation
- [ ] Cryptographic validation

**Files**: `packages/organs/immune/`

### Low Priority

#### 📚 Documentation
**Status**: Core docs complete, examples needed  
**Difficulty**: Easy  
**Skills**: Technical writing, clear communication  

Enhance documentation:
- [ ] Add code examples
- [ ] Create video tutorials
- [ ] Build interactive demos
- [ ] Write use-case guides
- [ ] Create architecture diagrams

**Files**: Various `.md` files and `/docs/` directory

#### 🧪 Testing
**Status**: Some tests exist, comprehensive coverage needed  
**Difficulty**: Easy-Medium  
**Skills**: Testing frameworks, TypeScript  

Improve test coverage:
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Cypress/Playwright)
- [ ] Load tests (k6)
- [ ] Security tests

**Files**: `*.test.ts` and `*.spec.ts`

---

## 📤 Submitting a Pull Request

### Before Submitting

```bash
# Make sure your code is up to date
git fetch upstream
git rebase upstream/main

# Run all checks
pnpm typecheck
pnpm lint
pnpm test
pnpm build

# Fix any issues
pnpm lint --fix    # Auto-fix linting issues
```

### Creating the PR

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Go to GitHub** and click "Compare & pull request"

3. **Fill in the PR template**:
   ```markdown
   ## Description
   Brief description of what this PR does
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation
   - [ ] Refactoring
   
   ## Testing
   How did you test this?
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests pass locally
   - [ ] No new warnings generated
   - [ ] Documentation updated
   ```

4. **Wait for review** (maintainers will review within 48 hours)

### PR Review Process

- ✅ **Automated checks**: Tests, linting, build
- ✅ **Code review**: Maintainers review for quality/fit
- ✅ **Feedback**: We may request changes
- ✅ **Merge**: Once approved, we'll merge your PR

---

## 🐛 Reporting Bugs

### Before Reporting

- [ ] Check if bug already exists (GitHub Issues)
- [ ] Reproduce the bug consistently
- [ ] Try on latest `main` branch
- [ ] Check [troubleshooting guide](./README.md#-faq)

### Bug Report Template

Create a new issue on GitHub with:

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 14.0]
- Node: [e.g., 20.5.0]
- Docker: [e.g., 24.0.0]
- Branch: [e.g., main]

## Logs
```
Paste relevant logs/errors here
```

## Screenshots
If applicable, add screenshots
```

---

## 💡 Feature Requests

### Before Requesting

- [ ] Check if feature already exists
- [ ] Check if feature is in roadmap (README.md)
- [ ] Consider if it aligns with DreamNet's vision

### Feature Request Template

```markdown
## Description
Clear description of the feature

## Use Case
Why do you need this?

## Proposed Solution
How should this work?

## Alternatives Considered
Other approaches you've thought of

## Additional Context
Any other information
```

---

## 🤖 Agent Contribution

DreamNet can accept contributions from both humans AND autonomous agents!

### For Agent Contributors

If you're deploying an agent to contribute:

1. **Register your agent** with the project
2. **Fork the repository** (agent fork)
3. **Make improvements** (via your agent)
4. **Submit PR** (agent signature required)
5. **Earn P.O.W.K. rewards** (if PR is merged)

See [Agent Contribution Framework](./AGENT_CONTRIBUTION.md) for details.

---

## 🏆 Recognition

All contributors are recognized in:

- **GitHub**: Auto-linked in commit history
- **README**: Credited in contributors section (with permission)
- **Changelog**: Listed in release notes
- **Rewards**: Potential P.O.W.K. token rewards (future)

---

## 📞 Questions?

- **GitHub Issues**: Ask on the issue tracker
- **GitHub Discussions**: General questions
- **Email**: contact@dreamnet.ink (for license/business questions)
- **Farcaster**: [@dreamnet.eth](https://warpcast.com/dreamnet.eth) (casual chat)

---

## 🙏 Thank You

We appreciate your contribution to DreamNet! Every PR, issue, and suggestion helps make the project better.

Let's build sovereign AI agents together. 🚀

---

*Last Updated: February 18, 2026*
