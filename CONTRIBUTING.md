# Contributing to Admin Shadcn React Starterkit

Thanks for your interest in contributing! This document explains how to set up the project, the conventions we follow, and how to submit changes.

Please also read our [Code of Conduct](./CODE_OF_CONDUCT.md) — we expect all contributors to follow it.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 11

### Setup

```bash
git clone https://github.com/baledev/admin-shadcn-react-starterkit.git
cd admin-shadcn-react-starterkit
pnpm install
pnpm dev
```

### Useful commands

```bash
pnpm dev         # Run all apps in dev mode
pnpm build       # Build all apps/packages
pnpm lint        # Lint all apps/packages
pnpm format      # Format code with Prettier
pnpm typecheck   # Type-check all apps/packages
```

## Project Structure

This is a Turborepo monorepo managed with pnpm workspaces:

- `apps/web` — the main admin dashboard app (routes, pages, app-level components)
- `packages/ui` — shared shadcn/ui components consumed via `@workspace/ui`

When adding UI components, prefer adding them to `packages/ui` via the shadcn CLI so they can be reused across future apps:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

## Branching

- Create your branch from `main`.
- Use a descriptive branch name prefixed by type, e.g.:
  - `feat/user-management-page`
  - `fix/sign-in-redirect-loop`
  - `docs/update-readme`
  - `chore/upgrade-deps`

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Commit messages must be structured as:

```
<type>: <short summary>

[optional body]

[optional footer]
```

### Types

| Type       | Use for                                                        |
| ---------- | --------------------------------------------------------------- |
| `feat`     | A new feature                                                   |
| `fix`      | A bug fix                                                       |
| `refactor` | Code change that neither fixes a bug nor adds a feature         |
| `docs`     | Documentation-only changes                                      |
| `style`    | Formatting, missing semicolons, etc. — no code logic change     |
| `perf`     | Performance improvement                                         |
| `test`     | Adding or correcting tests                                      |
| `chore`    | Tooling, build config, or dependency changes                    |
| `ci`       | CI/CD configuration changes                                     |

### Examples

```
feat: add user management table with pagination
fix: correct sign-in route path import and format route tree registry
chore: upgrade pnpm to v11 and add dependency release exclusions
docs: clarify backend integration steps in README
```

Keep the summary in imperative mood ("add", not "added"/"adds"), lowercase, and without a trailing period.

## Coding Conventions

- **Language**: TypeScript everywhere — avoid `any`, prefer explicit types on public function signatures.
- **Components**: functional components with hooks; colocate component-specific logic, avoid premature abstraction.
- **Shared UI**: reusable, presentation-only components belong in `packages/ui`; app-specific/business logic components stay in `apps/web/src/components`.
- **Styling**: Tailwind CSS utility classes; use `cn()` from `@workspace/ui/lib/utils` for conditional class names.
- **Routing**: file-based routes under `apps/web/src/routes`, following the existing `_auth` (protected) / `_guest` (public) layout convention.
- **Formatting/Linting**: run `pnpm format` and `pnpm lint` before committing — do not hand-format code that Prettier/ESLint already covers.
- **Imports**: group and order imports logically (external packages, then workspace packages, then relative imports).

## Pull Requests

1. Fork the repo (or create a branch if you have write access) and make your changes.
2. Make sure `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass locally.
3. Open a PR against `main` using the PR template — fill in the description, related issue, and checklist.
4. Keep PRs focused: one feature/fix per PR is easier to review than a bundle of unrelated changes.
5. A maintainer will review your PR and may request changes before merging.

## Reporting Bugs / Requesting Features

Please use the issue templates:

- 🐛 [Bug report](../../issues/new?template=bug_report.yml)
- ✨ [Feature request](../../issues/new?template=feature_request.yml)

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
