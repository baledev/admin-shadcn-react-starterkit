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

### 404 & error handling

Both pages live in `routes/` but are excluded from the route tree by the `-` prefix (`routeFileIgnorePrefix`), and share the presentational `ErrorState` component (`src/components/error-state.tsx`):

- `routes/-404.tsx` (`NotFoundPage`) — wired as `defaultNotFoundComponent` in `src/router.ts`.
- `routes/-error.tsx` (`ErrorPage`) — wired as `defaultErrorComponent` in `src/router.ts` (covers *every* route, since errors do not bubble to parent routes in TanStack Router) and as the root `errorComponent` in `__root.tsx`.
- `src/components/app-error-boundary.tsx` (`AppErrorBoundary`) — React class boundary wrapping `RouterProvider` in `app.tsx`, for crashes outside the router. Its fallback must not use router APIs (`<a href>`, not `<Link>`).

`notFoundMode: "root"` means a `notFound()` thrown anywhere renders the full-screen 404 at the root outlet rather than inside the dashboard shell.

For a detail route, throw `notFound()` when the record is missing — use `throw new Error(...)` only for genuine failures:

```tsx
import { createFileRoute, notFound } from "@tanstack/react-router"
import { initialOrders } from "@/lib/orders-data"

export const Route = createFileRoute("/_auth/orders/$orderId")({
  loader: ({ params }) => {
    const order = initialOrders.find((o) => o.id === params.orderId)
    if (!order) throw notFound()
    return order
  },
  component: OrderDetailPage,
})
```

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

---

## Design System

Follow every rule in this section exactly when writing any new component or page. Do not invent patterns not described here.

### Tech Stack & Tooling

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI runtime |
| TypeScript | ~6 | Type safety |
| Vite | 8 | Dev server & bundler |
| Tailwind CSS | v4 | Utility styling |
| shadcn/ui | `base-vega` style | Component library |
| TanStack Router | file-based | Routing |
| TanStack Table | v9 | Data tables (tree-shaken) |
| dnd-kit | 6 | Drag and drop |
| Recharts | 3 | Charts |
| Tabler Icons | `@tabler/icons-react` | **Primary** icon library |
| Inter Variable | `@fontsource-variable/inter` | Font |

---

### Design Tokens

All tokens are CSS custom properties defined in `packages/ui/src/styles/globals.css`. Tailwind v4 maps them to utility classes via `@theme inline`. **Never hardcode color hex or OKLCH values** in component files — always use semantic token classes.

#### Color tokens

| Token | Light | Dark | Tailwind class |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | `bg-background` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-foreground` |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | `bg-card` |
| `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | `bg-popover` |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | `bg-muted` |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | `text-muted-foreground` |
| `--primary` | `oklch(0.457 0.24 277)` | `oklch(0.398 0.195 277)` | `bg-primary`, `text-primary` |
| `--primary-foreground` | `oklch(0.962 0.018 272)` | same | `text-primary-foreground` |
| `--secondary` | `oklch(0.967 0.001 286)` | `oklch(0.274 0.006 286)` | `bg-secondary` |
| `--destructive` | `oklch(0.577 0.245 27)` | `oklch(0.704 0.191 22)` | `bg-destructive`, `text-destructive` |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | `border-border` |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | `border-input` |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | `ring-ring` |

#### Chart colors

Always use these for Recharts — never arbitrary colors.

| Variable | Usage |
|---|---|
| `--chart-1` | Primary series |
| `--chart-2` | Secondary series |
| `--chart-3` | Tertiary |
| `--chart-4` | Quaternary |
| `--chart-5` | Quinary |

In Recharts, reference as CSS variables:
```tsx
<Area dataKey="value" fill="var(--chart-1)" stroke="var(--chart-1)" />
```

#### Radius scale

Base `--radius: 0.625rem`. Use `rounded-lg` for cards/panels, `rounded-md` for inputs/badges, `rounded-sm` for chips.

#### Sidebar tokens

`--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, etc. — use **only** inside `NavMain`, `NavUser`, `AppSidebar`, `TeamSwitcher`. Never elsewhere.

---

### Typography

Font: Inter Variable, applied globally via `font-sans`.

| Class | Size | Usage |
|---|---|---|
| `text-[10px]` | 0.625rem | Sub-labels, weekday headers |
| `text-[11px]` | 0.6875rem | Activity chips, small status text |
| `text-xs` | 0.75rem | Labels, captions, timestamps, badge text |
| `text-sm` | 0.875rem | Body text, form labels, descriptions |
| `text-xl` | 1.25rem | Page title (`PageHeader` h1) |
| `text-2xl` | 1.5rem | Card KPI values (default) |
| `text-3xl` | 1.875rem | Card KPI values at `@[250px]/card:` |
| `text-8xl` | 6rem | Error page error code |

Rules:
- Page titles: always via `PageHeader` (`text-xl font-semibold`)
- Descriptions: always `text-sm text-muted-foreground`
- Numbers/metrics: always `tabular-nums`
- Uppercase labels: `text-xs font-medium tracking-widest uppercase text-muted-foreground`
- Truncation: `truncate` (single-line) or `line-clamp-1` / `line-clamp-2` (multi-line)

---

### Color Usage Rules

#### Foreground hierarchy

```
text-foreground          — primary content, headings, emphasized values
text-muted-foreground    — secondary content, labels, descriptions, timestamps
text-muted-foreground/40 — out-of-range / disabled items
text-primary             — interactive elements, links (use sparingly)
text-destructive         — errors, delete actions
```

#### Background hierarchy

```
bg-background    — page root, panels, main content area
bg-card          — card surfaces (elevated in dark mode)
bg-muted         — hover states, disabled zones, calendar today
bg-muted/60      — drag-over highlight (DnD droppable zones)
bg-muted/30      — very subtle, out-of-month cells
bg-popover       — dropdowns, tooltips, command palette
bg-primary       — primary action buttons, selected states
bg-foreground    — inverse (selected calendar day, today indicator)
```

#### Status / semantic colors

Do not use arbitrary Tailwind colors for status — use these consistent patterns:

| Status | Background | Text | Ring |
|---|---|---|---|
| Active / Success / Paid | `bg-emerald-500/15` | `text-emerald-700 dark:text-emerald-300` | `ring-emerald-500/30` |
| Warning / Low stock | `bg-amber-500/15` | `text-amber-700 dark:text-amber-300` | `ring-amber-500/30` |
| Info / Sent / Processing | `bg-blue-500/15` | `text-blue-700 dark:text-blue-300` | `ring-blue-500/30` |
| Special / Personal | `bg-violet-500/15` | `text-violet-700 dark:text-violet-300` | `ring-violet-500/30` |
| Destructive / Error / Overdue | `bg-destructive text-destructive-foreground` or `text-destructive` |

Always pair `dark:` variants when using arbitrary Tailwind colors. Use `ring-1` with ring color — never `border`.

---

### Component Usage Guidelines

#### Button

Import from `@workspace/ui/components/button`.

| Variant | When to use |
|---|---|
| `default` | Main CTA per page: "Add Customer", "Save Changes" |
| `outline` | Secondary actions: "Export", "Cancel", "Today" |
| `ghost` | Icon-only toolbar, sidebar nav, subtle controls |
| `destructive` | Irreversible delete — always inside a confirm Dialog |
| `secondary` | Tertiary actions needing more weight than ghost |
| `link` | Inline text links only |

| Size | When to use |
|---|---|
| `default` | Standard buttons in dialogs, forms |
| `sm` | `PageHeader` action buttons, compact toolbars |
| `icon` | Icon-only (must have `aria-label`) |
| `lg` | Auth page primary actions only |

Rules:
- Every `<button>` not from shadcn must have `type="button"` explicitly
- `Button size="icon"` must always have `aria-label`
- Never put `onClick` on a `<div>` — use `<button type="button">` or `Button`

#### Badge

Import from `@workspace/ui/components/badge`.

| Variant | When to use |
|---|---|
| `default` | Primary status, active state |
| `secondary` | Neutral/muted state (draft, inactive) |
| `outline` | KPI trend indicators in cards, role labels |
| `destructive` | Error/danger status (overdue, cancelled, out of stock) |

For semantic colored statuses pass `variant="outline"` and override with `className`:
```tsx
<Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30">
  Active
</Badge>
```

#### Sheet vs Dialog

| Use `Sheet` when | Use `Dialog` when |
|---|---|
| Create / edit a complex record (many fields) | Short confirmation or simple single-action |
| Form benefits from full vertical space | Form has 1–3 fields max |
| Sliding in feels natural (record detail) | Action is destructive (delete confirm) |
| Content needs scrolling | Content fits in a small centered box |

Sheet always: `side="right"` with `sm:max-w-md` (or `sm:max-w-lg` for complex forms).

For destructive confirmations do not hand-roll a Dialog — use `ConfirmDialog` (`@workspace/ui/components/confirm-dialog`), which wraps `Dialog` and takes `title` / `description` / `confirmLabel` / `variant` / `onConfirm`.

#### DataTable

Standard pattern uses TanStack Table v9 with tree-shaken features. Reference: `apps/web/src/components/customer-data-table.tsx`.

```ts
const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
})
```

```ts
import { DataTable, DataTableFacetedFilter } from "@workspace/ui/components/data-table"
```

Column helper pattern:
```ts
const columnHelper = createColumnHelper<YourType>()
const columns = [
  columnHelper.display({ id: "select", ... }),   // checkbox
  columnHelper.accessor("field", { ... }),
  columnHelper.display({ id: "actions", ... }),  // row actions
]
```

#### Row actions

Always a `DropdownMenu` with an `IconDotsVertical` trigger, `size="icon" variant="ghost"`. Reference: `apps/web/src/components/team-data-table.tsx`.

Every `DropdownMenuItem` must lead with a Tabler icon:

```tsx
<DropdownMenuItem onClick={() => onEdit(row.original)}>
  <IconPencil className="mr-2 size-4" aria-hidden="true" />
  Edit
</DropdownMenuItem>
```

Destructive items also take `variant="destructive"`, and **must** go through `ConfirmDialog` from `@workspace/ui/components/confirm-dialog` — never mutate straight from the menu item. Applies to Delete, Remove, Cancel order, Deactivate, and anything else that is hard to undo. Restorative counterparts (Reactivate, Restore) run immediately, without a dialog.

Render `ConfirmDialog` as a sibling of `<DataTable>`, **never inside `DropdownMenuContent`** — the menu unmounts its content when an item is clicked, which would tear the dialog down with it. The menu item stores a pending action instead:

```tsx
const [pendingDelete, setPendingDelete] = React.useState<Product | null>(null)

return (
  <>
    <DataTable ... />
    <ConfirmDialog
      open={pendingDelete !== null}
      onOpenChange={(open) => { if (!open) setPendingDelete(null) }}
      title="Delete product?"
      description={<><span className="font-medium text-foreground">{pendingDelete?.name}</span> will be permanently removed. This action cannot be undone.</>}
      confirmLabel="Delete"
      onConfirm={() => { if (pendingDelete) onDelete(pendingDelete); setPendingDelete(null) }}
    />
  </>
)
```

`buildColumns()` receives the *setter* for actions that need confirmation, and the plain callback for those that don't.

When a `TableRow` has its own `onClick` (row opens a detail sheet), the menu trigger and every menu item must call `event.stopPropagation()` — React propagates events through the portal via the React tree, not the DOM tree, so a click inside the menu otherwise also fires the row handler. Same for the row-select `Checkbox`.

#### Card

```tsx
<Card className="@container/card">
  <CardHeader>
    <CardDescription>Label</CardDescription>
    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
      Value
    </CardTitle>
    <CardAction>
      <Badge variant="outline">+12%</Badge>
    </CardAction>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">Trend label</div>
    <div className="text-muted-foreground">Supporting context</div>
  </CardFooter>
</Card>
```

KPI card grid: `grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4`

Dashboard card gradient:
```
*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card
*:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card
```

#### Select, Input, Textarea

- Always wrap with `Field` + `FieldLabel` from `@workspace/ui/components/field` inside forms
- `Textarea` baseline: `className="min-h-24 resize-none"`
- Search inputs: use `IconSearch` in a relative wrapper, not inside `Input`

#### Tabs

Use for switching views within the same page. Do not use for navigation between routes.

---

### Icon Usage

**Primary library**: `@tabler/icons-react` — all new icons must come from here.

**Existing lucide-react**: `app-sidebar.tsx` and `section-cards.tsx` use lucide. Do not add new lucide imports anywhere.

All Tabler icons use `Icon*` prefix:
```tsx
import { IconPlus, IconTrash, IconChevronLeft } from "@tabler/icons-react"
```

Size conventions:

| Context | Class |
|---|---|
| Button icons, inline with text | `size-4` |
| Icon-only button, list item prefix | `size-4` or `size-5` |
| Empty state illustration | `size-12` or `size-16`, `text-muted-foreground` |

Common icon map:

| Action / Concept | Icon |
|---|---|
| Add / Create | `IconPlus` |
| Edit | `IconPencil` |
| Delete | `IconTrash` |
| View details | `IconEye` |
| Duplicate / Copy | `IconCopy` |
| Cancel / Block | `IconBan` |
| Favorite | `IconStar` / `IconStarFilled` (active) |
| Deactivate / Reactivate user | `IconUserX` / `IconUserCheck` |
| Close / Remove | `IconX` |
| Search | `IconSearch` |
| More actions | `IconDotsVertical` |
| Download | `IconDownload` |
| Upload | `IconUpload` |
| Chevron navigation | `IconChevronLeft`, `IconChevronRight`, `IconChevronDown` |
| Drag handle | `IconGripVertical` |
| Calendar | `IconCalendar` |
| Notification / Bell | `IconBell` |
| Message | `IconMessage` |
| Users (team) | `IconUsers` |
| Orders | `IconShoppingCart` |
| Products | `IconPackage` |
| Invoices | `IconReceipt` |
| Analytics | `IconChartBar` |
| Files | `IconFolder` |
| Settings | `IconSettings` |
| Check / Success | `IconCheck` |
| Warning | `IconAlertTriangle` |
| Info | `IconInfoCircle` |

---

### Page Layout Patterns

#### Standard protected page shell

Every page under `_auth/` must use this exact wrapper:

```tsx
export function SomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* PageHeader */}
          {/* Content */}
        </div>
      </div>
    </div>
  )
}
```

- Outer `div`: `flex flex-1 flex-col` — fills `SidebarInset` height
- Middle `div`: `@container/main` — enables `@xl/main:`, `@5xl/main:` container queries
- Inner `div`: vertical rhythm `gap-4 py-4 md:gap-6 md:py-6`

#### PageHeader

```tsx
import { PageHeader } from "@/components/page-header"

<PageHeader title="Orders" description="Manage and track all customer orders.">
  <Button size="sm">
    <IconPlus className="size-4" />
    Add Order
  </Button>
</PageHeader>
```

`children` is right-aligned. Use for the primary CTA only.

#### Two-column layout with side panel

```tsx
<div className="flex flex-col gap-4 md:flex-row">
  <div className="min-w-0 flex-1">{/* Main content */}</div>
  <div className="hidden w-60 shrink-0 flex-col gap-4 md:flex">{/* Side panel */}</div>
</div>
```

#### Empty state

```tsx
<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <IconInbox className="size-12 text-muted-foreground/50" />
  <div>
    <p className="text-sm font-medium">No items yet</p>
    <p className="text-sm text-muted-foreground">Create your first item to get started.</p>
  </div>
  <Button size="sm"><IconPlus className="size-4" />Add Item</Button>
</div>
```

#### Full-viewport centered (error/auth pages)

```tsx
<div className="min-h-svh flex items-center justify-center p-4">
  {/* Content */}
</div>
```

---

### Naming Conventions

#### Files

| Type | Pattern | Example |
|---|---|---|
| Route page | `kebab-case.tsx` in `routes/_auth/` | `orders.tsx` |
| App component | `kebab-case.tsx` in `components/` | `order-data-table.tsx` |
| Shared UI primitive | `kebab-case.tsx` in `packages/ui/src/components/` | `data-table.tsx` |
| Data lib | `*-data.ts` in `src/lib/` | `orders-data.ts` |
| Utility lib | descriptive in `src/lib/` | `date-utils.ts` |
| Route group layout | `_name.tsx` | `_auth.tsx` |

#### Components & variables

- Exported components: `PascalCase`, named export (never default export)
- Internal sub-components: `PascalCase`, not exported
- Props interface: `ComponentNameProps`
- Constants/static data: `SCREAMING_SNAKE_CASE` (e.g. `STATUS_OPTIONS`, `CATEGORY_META`)
- Event handlers: `handle` prefix (`handleDragEnd`, `handleSubmit`)
- Boolean state: `is` or `has` prefix (`isOpen`, `hasError`)

#### Route file names → breadcrumb labels

TanStack Router auto-derives breadcrumb via `titleCase()` of the filename:
- `orders.tsx` → "Orders"
- `team.tsx` → "Team"
- `file-manager.tsx` → "File Manager"

---

### Mock Data Patterns

All mock data lives in `apps/web/src/lib/*-data.ts`. Structure every file as:

```ts
// 1. Type definitions
export type Status = "active" | "inactive"
export type Entity = { id: string; /* ...fields */ }

// 2. Display metadata
export const STATUS_META: Record<Status, { label: string; chip: string; dot: string }> = {
  active: {
    label: "Active",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
  },
}

// 3. Filter options (for DataTableFacetedFilter)
export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "active", label: "Active" },
]

// 4. Static data array
export const initialEntities: Entity[] = [ ... ]

// 5. Pure helper functions
export function filterByStatus(items: Entity[], status: Status): Entity[] {
  return items.filter((i) => i.status === status)
}
```

ID format conventions:

| Entity | Format | Example |
|---|---|---|
| Orders | `ORD-NNNN` | `ORD-0042` |
| Products | `PRD-NNN` | `PRD-007` |
| Invoices | `INV-YYYY-NNN` | `INV-2026-012` |
| Team members | `USR-NNN` | `USR-003` |
| Notifications | `notif-N` | `notif-1` |
| Conversations | `conv-N` | `conv-1` |
| Files | `file-N` | `file-12` |

Dates: always ISO strings (`"yyyy-MM-dd"` for date, `"HH:mm"` for time). Use `src/lib/date-utils.ts` — **never** import `date-fns` in `apps/web`.

```ts
import { toIsoDate, addDays } from "@/lib/date-utils"
const today = new Date()
date: toIsoDate(today)
date: toIsoDate(addDays(today, 3))
```

---

### Responsive Design Rules

Mobile-first. Base styles target mobile; use prefixes to enhance progressively.

#### Viewport breakpoints

| Prefix | Min-width | Primary use |
|---|---|---|
| `sm:` | 640px | Auth forms, sheet widths |
| `md:` | 768px | Sidebar panels, row layouts |
| `lg:` | 1024px | Wider grid columns |
| `xl:` | 1280px | Rarely needed — prefer container queries |

#### Container queries (preferred inside main content)

| Prefix | Used for |
|---|---|
| `@xl/main:` | 2-column KPI card grid |
| `@5xl/main:` | 4-column KPI card grid |
| `@[250px]/card:` | `text-3xl` KPI value inside card |
| `@sm:` | Local grid adjustments |

The `SidebarInset` content area shrinks/grows with sidebar state — always use `@container/main` queries instead of viewport breakpoints inside pages.

Hidden/shown patterns:
- Mobile-only: `md:hidden`
- Desktop-only: `hidden md:flex` or `hidden md:block`
- Side panel: `hidden w-60 shrink-0 flex-col gap-4 md:flex`

---

### Accessibility

Non-negotiable requirements for every component.

**Icon-only buttons** — must have `aria-label`:
```tsx
<Button variant="ghost" size="icon" aria-label="Previous month" onClick={handlePrev}>
  <IconChevronLeft className="size-4" />
</Button>
```

**Button type** — every `<button>` that is not a submit must have `type="button"`:
```tsx
<button type="button" onClick={handleClick}>...</button>
```

**Decorative icons** — must have `aria-hidden="true"` when icon accompanies visible text:
```tsx
<IconCalendar className="size-4" aria-hidden="true" />
<span>View Calendar</span>
```

**Tabular numbers** — any value that changes (metrics, totals, IDs) must have `tabular-nums`:
```tsx
<span className="tabular-nums">1,234.56</span>
```

**Semantic HTML**:
- `<h1>` inside `PageHeader` (handled automatically)
- Section headings: `<h2>` with `text-sm font-medium`
- Tabular data: always `DataTable` component — never `<div>` grids
- Interactive list items: `<button>` or `<a>`, never `<div onClick>`

**Focus management**:
- Dialogs/Sheets: focus trapped automatically by Radix
- DnD keyboard: include `KeyboardSensor` alongside `PointerSensor` in all sortable `DndContext` (see `kanban.tsx`)
