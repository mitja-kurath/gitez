# gitez

gitez is a lightweight, opinionated helper on top of Git that provides a simple, guided workflow through a CLI and a TUI, while using the system Git under the hood. It aims to make common tasks easier without hiding Git’s power.

Status: early v0. One action is implemented end-to-end:
- Start feature: create a feature branch safely from your base branch, and set upstream automatically if a remote exists.

Monorepo packages
- @gitez/core — domain logic (actions, configuration, types)
- @gitez/adapter-git — adapter that shells out to system Git
- @gitez/cli — Clipanion-based CLI
- @gitez/tui — Ink-based terminal UI

Requirements
- Node.js ≥ 18
- Git available on PATH
- pnpm (for development)

Installation (development)
1) Install dependencies and build:
```bash
pnpm install
pnpm -r run build
```

2) Optionally link the CLI globally:
```bash
pnpm setup       # one-time, sets PNPM_HOME and PATH if needed
pnpm -F @gitez/cli link -g
```

Quick start
1) In any Git repository, add a minimal gitez config:
```json
// .gitez.json
{
  "defaultBase": "main",
  "branchingModel": "trunk",
  "branchPrefix": "feature"
}
```
If your base branch is named “master”, set "defaultBase": "master".

2) Use the CLI:
- Dry run a feature:
```bash
gitez start my-feature --dry-run
```
- Create the branch:
```bash
gitez start my-feature
```

What the Start Feature action does
- Ensures your working tree is clean (please commit or stash first)
- Fetches from origin if the remote exists
- Checks out the base branch if it exists locally
- Creates feature/my-feature
- If a remote exists (origin), pushes with upstream (-u) so the branch tracks origin automatically; otherwise it skips upstream without failing

3) Use the TUI:
```bash
gitez tui
```
Type a branch name and press Enter. Press ESC to exit.

Notes and current limitations
- If no “origin” remote is configured, the branch is created locally and upstream is skipped.
- If the configured base branch does not exist locally, the checkout step is skipped.
- Start feature requires a clean working tree.

Roadmap
- Sync: fetch, fast-forward base, rebase current branch safely, surface conflicts
- Commit wizard: stage selection and conventional commit helper
- PR wizard: GitHub/GitLab adapters, CODEOWNERS, labels, auto-merge
- Conflict assistant (TUI and later VS Code)
- Repository hygiene (e.g., LFS guard, large file detector)
- Plugin API (hooks, provider adapters, UI contributions)

Contributing
Please see CONTRIBUTING.md.

License
MIT License. See LICENSE.