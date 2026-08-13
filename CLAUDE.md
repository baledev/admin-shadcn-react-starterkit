# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A backend-agnostic admin dashboard starter kit: React 19 + shadcn/ui + TanStack Router, in a Turborepo/pnpm monorepo. The frontend has no backend wired in — auth and data are currently mocked/local so any API (Go, Express, NestJS, FastAPI, etc.) can be integrated later. See `README.md` and `CONTRIBUTING.md` for product framing and commit/coding conventions.

## Commands

Run from the repo root unless noted. All tasks are orchestrated by Turborepo (`turbo.json`) and fan out to every app/package via `^` dependency ordering.

```bash
pnpm install         # install all workspace deps
pnpm dev              # turbo dev — runs apps/web on Vite (persistent, uncached)
pnpm build            # turbo build — tsc -b && vite build per app
pnpm lint             # turbo lint — eslint per package
pnpm format           # turbo format — prettier --write "**/*.{ts,tsx}"
pnpm typecheck        # turbo typecheck — tsc --noEmit per package
```

Scoped to a single workspace (faster during iteration):

```bash
pnpm --filter web dev
pnpm --filter web typecheck
pnpm --filter @workspace/ui lint
```

There is no test runner configured in this repo yet (no `test` script/task).

### Adding shadcn/ui components

Always add through the shadcn CLI targeting `apps/web` — it writes into `packages/ui/src/components`, not into the app itself:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

`apps/web/components.json` controls the CLI (style `base-vega`, neutral base color, Tabler icon library, RTL support). Import shared components from the workspace package, not by relative path:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Architecture

### Monorepo layout

- `apps/web` — the only app today. Owns routing, pages, app-specific (non-reusable) components, and the auth stub.
- `packages/ui` (`@workspace/ui`) — shared shadcn/ui primitives, hooks, and `src/styles/globals.css` (the single Tailwind v4 entry point, referenced by `components.json`). Exports are subpath-based (`./components/*`, `./lib/*`, `./hooks/*`) — see `packages/ui/package.json` `exports`.

New apps (e.g. a marketing site, a second dashboard) should live under `apps/*` and consume `@workspace/ui` rather than duplicating components.

### Routing (TanStack Router, file-based)

Routes live in `apps/web/src/routes` and are compiled into `apps/web/src/routeTree.gen.ts` by the `@tanstack/router-plugin` Vite plugin (`vite.config.ts`) — **never hand-edit `routeTree.gen.ts`**; it regenerates on dev/build whenever files under `routes/` change.

Two pathless layout routes gate access via `beforeLoad`, both reading `context.auth` (typed in `routes/__root.tsx` via `createRootRouteWithContext<{ auth: AuthContext }>()`):

- `_guest.tsx` — redirects to `/dashboard` if a user is already signed in. Wraps `sign-in` / `sign-up`.
- `_auth.tsx` — redirects to `/sign-in` if there's no user. Wraps `dashboard`, `settings`, etc., and renders the shared shell (`AppSidebar`, header with breadcrumb, `NotificationsBlock`, `ThemeToggle`).

When adding a new protected page, create a file under `routes/_auth/`; for public pages, under `routes/_guest/`. The breadcrumb label in `_auth.tsx` is auto-derived from the leaf route segment (`titleCase` of the last path part) — no manual registration needed.

### Auth (mock, replace with real backend)

`apps/web/src/lib/auth.ts` defines `AuthUser`/`AuthContext` and persists the user to `localStorage` (`auth:user`) — there is no network call. `app.tsx` is the composition root:

- Holds the real `user` state and a real `auth` object (with working `signIn`/`signOut`) that it passes to `RouterProvider`'s `context` prop.
- Separately constructs the router once via `createAppRouter` with a **stub** auth context (no-op `signIn`/`signOut`, initial user snapshot only) — the router needs *a* context object at creation time, but the live one flows in through `RouterProvider context={auth}` on every render and is what route `beforeLoad` hooks actually see.
- Calls `router.invalidate()` in a `useEffect` when `user` identity changes, so `beforeLoad` redirects re-run after sign-in/sign-out.

When wiring a real backend, replace the body of `signIn`/`signOut` in `app.tsx` and the storage functions in `lib/auth.ts` — the route-level `beforeLoad` guards and the `AuthContext` shape can stay as-is.

### Styling & path aliases

- Tailwind v4 via `@tailwindcss/vite`; the single CSS entry point is `packages/ui/src/styles/globals.css`.
- `apps/web` aliases: `@/*` → `apps/web/src/*`, `@workspace/ui/*` → `packages/ui/src/*` (defined in both `tsconfig.json` paths and `vite.config.ts` resolve.alias — keep them in sync if changed).
- Class merging: use `cn()` from `@workspace/ui/lib/utils` (clsx + tailwind-merge) for conditional classes.

### Lint config quirk

`apps/web/eslint.config.js` disables `react-refresh/only-export-components` specifically for `src/routes/**/*` since route files legitimately export non-component values (the `Route` object) alongside the page component.
