# AGENTS
role: "Repo caretaker for DreamNet"
languages: ["TypeScript","Python"]
build: ["pnpm install","pnpm build"]
test: ["pnpm test -i --reporter=dot"]
ci_notes: "Use GitHub Actions. Do not add new services."
merge_policy: "Open PR. Never push to main."
code_style: "Prettier + ESLint"
reviewers: ["brandon-ducar"]
risk_checks:
  - "Run tests"
  - "Explain changes in PR body"
tasks_allowed:
  - "Fix build/test"
  - "Small refactors"
  - "Typed API clients"
