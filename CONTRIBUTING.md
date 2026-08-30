# Contributing to build-planner

Thanks for helping build this. A few conventions to keep the repo easy to
work in as more people contribute.

## Branch naming

Format: `<type>/<issue-number>-<short-description>`

```
feat/5-questionnaire-ui
fix/9-pdf-export-timeout
chore/1-repo-scaffold
docs/readme-update
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`.

Never commit directly to `main` — it's protected and requires a PR.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/), no emojis:

```
feat(web): add questionnaire form
fix(backend): handle openai refusal response
chore(shared): pin typescript to 5.9.3
docs(readme): add setup instructions
```

Scope (in parentheses) should match the workspace you touched: `web`,
`backend`, `shared`, or omit it for repo-wide changes.

## Before opening a PR

Run these from the repo root — they mirror what CI runs, so if they pass
locally, CI should pass too:

```bash
npm run lint --workspaces --if-present
npm run build --workspaces --if-present
```

Also make sure:
- You've tested the change locally (both apps running, if relevant)
- You haven't included unrelated changes (formatting-only diffs on files you
  didn't otherwise touch, stray `console.log`s, etc.)
- If you changed anything in `packages/shared`, both `apps/backend` and
  `apps/web` still build against it

## Opening a PR

- Use the PR template — fill in the checklist honestly, don't just tick boxes
- Link the issue it closes (`Closes #12`)
- Tag at least one reviewer

## Merging

`main` requires at least one approval before merging. Approval from **any**
collaborator is sufficient — reviews aren't limited to a single gatekeeper.
Once approved and CI passes, any collaborator can merge.

## Project structure conventions

Inside `apps/backend`, keep the layering intentional:
- **`routes/`** — thin handlers only: parse the request, call a service,
  return a response. No business logic here.
- **`services/`** — where the actual logic lives (prompt construction,
  OpenAI calls, PDF rendering).
- **`models/`** *(when introduced)* or `packages/shared` — types and schemas.

If you're adding a new file or folder that isn't already scoped in the issue
you're working from, mention it in the PR description so reviewers know it
was an intentional addition, not scope creep.