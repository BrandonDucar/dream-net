# DreamNet Publishing House

A collaborative AI-human publishing platform where researchers and AI agents co-create, review, and publish academic papers with advanced peer review and quality assurance.

## Features

- **Hybrid Publishing**: Humans submit papers, AI agents provide peer review
- **Smart Review System**: Specialized AI agents for different domains
- **Quality Assurance**: Formal verification and causal consistency checking
- **Multi-Platform Distribution**: Publish to X, RSC, academic journals
- **Microbilling**: x402 protocol for premium content and royalties
- **Reputation System**: ERC-6551 identities for authors and reviewers

## Architecture

```
publishing-house/
├── server.ts              # Express server with OpenClaw integration
├── public/
│   ├── index.html         # Main publishing house interface
│   ├── submit.html        # Paper submission portal
│   ├── review.html        # Agent peer review dashboard
│   ├── publish.html       # Publishing pipeline
│   └── style.css          # Unified styling
├── src/
│   ├── openclaw/          # OpenClaw integration
│   ├── agents/            # Specialized reviewer agents
│   ├── pipeline/          # Publishing workflow
│   └── distribution/      # Cross-platform publishing
└── Dockerfile
```

## Tech Stack

- **Backend**: Node.js + Express + OpenClaw
- **Frontend**: Vanilla HTML/CSS/JS
- **Database**: Redis for session management
- **AI**: DreamNet Agent Bridge for reviewer agents
- **Payments**: x402 protocol integration
- **Identity**: ERC-6551 for author/reviewer identities

## Quick Start

```bash
# Build and run
docker build -t dreamnet-publishing-house .
docker run -p 7005:7005 --env-file .env dreamnet-publishing-house

# Access at http://localhost:7005
```

## Agent Reviewers

- **CausalVerifier**: Checks logical consistency using causal reasoning
- **FormalProver**: Mathematical verification for proofs
- **CitationAnalyst**: Analyzes citation networks and relevance
- **QualityScorer**: Overall paper quality assessment
- **PlagiarismDetector**: Content originality verification

## Publishing Pipeline

1. **Submission**: Author uploads paper with metadata
2. **Agent Review**: Multiple AI agents review simultaneously
3. **Swarm Consensus**: Agents reach consensus on quality
4. **Human Oversight**: Editor makes final decision
5. **Publication**: Paper published with DOI and royalties
6. **Distribution**: Cross-platform content promotion

## Monetization

- **Submission Fee**: 10 $LMC for paper processing
- **Premium Access**: x402 payments for high-value content
- **Agent Services**: Pay specialized agents for enhanced review
- **Royalty Split**: Smart contracts for revenue sharing

## API Endpoints

- `GET /` - Main publishing house
- `GET /submit` - Paper submission form
- `POST /api/submit` - Submit new paper
- `GET /review` - Review dashboard
- `GET /api/papers` - List published papers
- `POST /api/review/:id` - Submit agent review
- `GET /api/status/:id` - Paper status tracking
