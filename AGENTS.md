# Agent Commit Instructions

Use these practices before creating future commits in this repository:

- Inspect the working tree with `git status --short --branch`, `git diff --stat`, and `git diff --name-status`.
- Group commits by functional scope, keeping setup, docs, tests, and feature code separate when possible.
- If any divergence, out-of-scope change, unexpected implementation detail, or decision that affects business rules or architecture is found, ask whether it was intentional, a mistake, or requires a business/architecture decision change before proceeding.
- Always summarize what will be sent before any operation that changes remote or persistent project state, including commits, issue updates, comments, pushes, and pull requests. Wait for confirmation or corrections before performing the operation.
- Use English commit messages.
- Use the pattern `feat(IS#001): description` when a commit maps to an issue. Replace `001` with the issue number.
- Use conventional scopes without issue IDs only when no issue is related, for example `docs: add diagrams` or `chore: update tooling`.
- Before committing issue-related work, check open GitHub issues for checklists and acceptance criteria.
- Comment on the related issue with what the commit implemented, which checklist items appear covered, what remains open, and whether the issue can be closed.
- Do not mark an issue as complete unless every checklist item and acceptance criterion has been verified.
- Run the relevant verification commands before the final commit summary, usually `npm test`, `npm run lint`, and `npx tsc --noEmit` when available.
- Keep local-only files out of commits, especially `.env`, SQLite databases, generated temp files, and dependency folders.
