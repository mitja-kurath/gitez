# Contributing to gitez

Thank you for your interest in contributing. Contributions of all kinds are welcome, including features, bug fixes, documentation, and tests. This guide explains the project structure, how to set up your environment, and how to submit changes.

Repository structure
- packages/core — core logic (actions, config, types)
- packages/adapter-git — integration with system Git (shells out)
- packages/cli — CLI application (Clipanion)
- packages/tui — terminal UI (Ink)

Prerequisites
- Node.js ≥ 18
- Git available on PATH
- pnpm

Development setup
```bash
pnpm install
pnpm -r run build
```

Run the CLI locally
- Option A: link globally
```bash
pnpm setup
pnpm -F @gitez/cli link -g
gitez --help
```
- Option B: run in dev mode without global link
```bash
pnpm -F @gitez/cli run dev
```

Testing the current feature (Start Feature)
1) Use a test repository with a base branch (main or master).
2) Create a gitez config in the repository root:
```json
{
  "defaultBase": "main",
  "branchingModel": "trunk",
  "branchPrefix": "feature"
}
```
3) Execute:
```bash
gitez start example --dry-run
gitez start example
```

Coding guidelines
- Language: TypeScript with strict mode
- Modules: ESM
- Structure: Keep @gitez/core pure (no Node or UI dependencies)
- Formatting: Prettier; linting with ESLint (to be expanded)
- Error handling: Prefer clear, actionable error messages

Commit messages
- Use Conventional Commits where possible:
  - feat: add sync action
  - fix(cli): handle missing origin gracefully
  - docs: update README quickstart
  - refactor(core): extract plan runner
  - chore: update dependencies

Branching
- Use short-lived feature branches from the base branch (main/master):
  - feature/<short-name>

Pull request process
1) For significant changes, open an issue or draft PR first to discuss design and scope.
2) Ensure the workspace builds:
```bash
pnpm -r run build
```
3) Add or update documentation if needed.
4) Ensure CI passes (see .github/workflows/ci.yml).
5) Request a review.

Roadmap tasks suitable for first contributions
- Improve error messages for missing origin or dirty working trees
- Add optional auto-stash prompt to the CLI/TUI for Start Feature
- Add unit test scaffolding for @gitez/core (Vitest)
- Add E2E test harness using temporary repositories

Community guidelines
- Please be respectful and follow the CODE_OF_CONDUCT.md.
- Use issues and discussions for questions and proposals.

Thank you for contributing.