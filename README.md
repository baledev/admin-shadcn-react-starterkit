# Admin Shadcn React Starterkit

A **backend-agnostic** admin dashboard starter kit built with **React**, **shadcn/ui**, and **TanStack Router**, organized as a **Turborepo** monorepo. The frontend is fully decoupled from the backend, so you can plug in any API layer — Go, Express.js, NestJS, FastAPI, or anything else — with minimal adjustments and start building real features right away instead of wiring up boilerplate.

## Features

- ⚡️ **Vite + React 19** for a fast dev experience
- 🎨 **shadcn/ui** components shared via a workspace package (`@workspace/ui`)
- 🧭 **TanStack Router** with file-based routing and guarded `_auth` / `_guest` layouts
- 🔐 Ready-to-use authentication flow (sign-in, sign-up, sign-out) with a pluggable `auth` lib — swap in any backend/API by adjusting a thin integration layer
- 📊 Dashboard building blocks: charts (Recharts), data tables (TanStack Table), and drag-and-drop (dnd-kit)
- 🌓 Light/dark theme toggle
- 🔔 Notifications block in the header
- 📦 Turborepo monorepo with shared UI package and consistent lint/format/typecheck across apps — ready to grow with additional apps/services (frontend or backend) as your stack expands

## Tech Stack

| Category   | Tooling                                      |
| ---------- | --------------------------------------------- |
| Framework  | React 19, Vite                                |
| UI         | shadcn/ui, Tailwind CSS, lucide-react, Tabler Icons |
| Routing    | TanStack Router                               |
| Data       | TanStack Table, Recharts                      |
| Monorepo   | Turborepo, pnpm workspaces                    |
| Tooling    | TypeScript, ESLint, Prettier                  |

## Project Structure

```
.
├── apps/
│   └── web/                # Main admin dashboard app
│       └── src/
│           ├── components/ # App-level components (sidebar, nav, forms, charts, etc.)
│           ├── lib/        # Auth logic and utilities
│           └── routes/     # File-based routes (_auth, _guest layouts)
└── packages/
    └── ui/                 # Shared shadcn/ui component package (@workspace/ui)
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 11

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This runs the `dev` task across the monorepo via Turborepo, starting the `web` app locally.

### Build

```bash
pnpm build
```

### Other commands

```bash
pnpm lint        # Lint all packages/apps
pnpm format      # Format code with Prettier
pnpm typecheck    # Type-check all packages/apps
```

## Adding shadcn/ui Components

To add components to the `web` app, run the following command at the root of the repo:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This places the UI components in the `packages/ui/src/components` directory.

## Using Components

Import shared components from the `@workspace/ui` package:

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Roadmap

This starter kit currently includes sign-in, sign-up/sign-out, and a dashboard page. More admin pages (users, settings, reports, etc.) are planned as the project grows.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, commit/coding conventions, and the PR process. This project also follows a [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

Licensed under the [MIT License](./LICENSE) — you're free to use, modify, and distribute this starter kit for personal or commercial projects, with no obligation beyond keeping the original copyright notice. See the [LICENSE](./LICENSE) file for the full text.
