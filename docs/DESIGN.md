# Design System

AI agent reference for building pages and components in this codebase. Follow every rule here exactly — do not invent patterns not described in this document.

---

## 1. Tech Stack & Tooling

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

**Monorepo layout**:
- `apps/web/src/` — pages, app-specific components, lib
- `packages/ui/src/components/` — all shared shadcn primitives
- `packages/ui/src/styles/globals.css` — single Tailwind entry point, all CSS tokens

---

## 2. Design Tokens

All tokens are CSS custom properties defined in `packages/ui/src/styles/globals.css`. Tailwind v4 maps them to utility classes via `@theme inline`. **Never hardcode color hex or OKLCH values** in component files — always use semantic token classes.

### Color tokens

| Token | Light | Dark | Tailwind class |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | `bg-background` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-foreground` |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | `bg-card` |
| `--card-foreground` | same as foreground | same | `text-card-foreground` |
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

### Chart colors

Always use these for Recharts — never arbitrary colors.

| Variable | Tailwind | Usage |
|---|---|---|
| `--chart-1` | `text-chart-1` / `fill-chart-1` | Primary series |
| `--chart-2` | `text-chart-2` / `fill-chart-2` | Secondary series |
| `--chart-3` | `text-chart-3` / `fill-chart-3` | Tertiary |
| `--chart-4` | `text-chart-4` / `fill-chart-4` | Quaternary |
| `--chart-5` | `text-chart-5` / `fill-chart-5` | Quinary |

In Recharts, reference them as CSS variables directly:
```tsx
<Area dataKey="value" fill="var(--chart-1)" stroke="var(--chart-1)" />
```

### Radius scale

Base radius is `--radius: 0.625rem`. All variants are derived:

| Token | Value | Tailwind |
|---|---|---|
| `--radius-sm` | `calc(var(--radius) * 0.6)` ≈ 0.375rem | `rounded-sm` |
| `--radius-md` | `calc(var(--radius) * 0.8)` ≈ 0.5rem | `rounded-md` |
| `--radius-lg` | `var(--radius)` = 0.625rem | `rounded-lg` |
| `--radius-xl` | `calc(var(--radius) * 1.4)` ≈ 0.875rem | `rounded-xl` |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` ≈ 1.125rem | `rounded-2xl` |

Use `rounded-lg` as the default radius for cards, panels, and containers. Use `rounded-md` for inputs, badges, and small elements. Use `rounded-sm` for chips and inline elements.

### Sidebar tokens

Sidebar has its own parallel token set — use only within sidebar components:

```
--sidebar, --sidebar-foreground, --sidebar-primary, --sidebar-primary-foreground,
--sidebar-accent, --sidebar-accent-foreground, --sidebar-border, --sidebar-ring
```

Do not use these tokens outside of `NavMain`, `NavUser`, `AppSidebar`, `TeamSwitcher`.

---

## 3. Typography

**Font**: Inter Variable — applied globally via `font-sans` on `html`.

### Scale in use

| Class | Size | Weight | Usage |
|---|---|---|---|
| `text-xs` | 0.75rem | varies | Labels, captions, timestamps, badge text, table metadata |
| `text-[10px]` | 0.625rem | `font-medium` | Sub-labels, weekday headers in calendar |
| `text-[11px]` | 0.6875rem | `font-medium` | Activity chips, small status text |
| `text-sm` | 0.875rem | varies | Body text, form labels, descriptions |
| `text-base` | 1rem | — | Avoid — not explicitly used |
| `text-xl` | 1.25rem | `font-semibold` | Page title (`PageHeader` h1) |
| `text-2xl` | 1.5rem | `font-semibold` | Card KPI values at default |
| `text-3xl` | 1.875rem | `font-semibold` | Card KPI values at `@[250px]/card:` container breakpoint |
| `text-8xl` | 6rem | `font-bold` | Error page error code |

### Rules

- Page titles: always `text-xl font-semibold` via `PageHeader`
- Descriptions / subtitles: always `text-sm text-muted-foreground`
- Numbers / metrics: always add `tabular-nums` to prevent layout shift
- Uppercase labels: `text-xs font-medium tracking-widest uppercase text-muted-foreground` (see `PageHeader` subtitle)
- Truncation: use `truncate` for single-line overflow, `line-clamp-1` / `line-clamp-2` for multi-line

---

## 4. Color Usage Rules

### Foreground hierarchy

```
text-foreground          — primary content, headings, emphasized values
text-muted-foreground    — secondary content, labels, descriptions, timestamps
text-muted-foreground/40 — out-of-range / disabled items (e.g. calendar days outside month)
text-primary             — interactive elements, links (use sparingly)
text-destructive         — errors, delete actions
```

### Background hierarchy

```
bg-background    — page root, panels, main content area
bg-card          — card surfaces (slightly elevated in dark mode)
bg-muted         — subtle backgrounds, hover states, disabled zones, calendar today
bg-muted/60      — drag-over highlight (DnD droppable zones)
bg-muted/30      — very subtle, out-of-month cells
bg-popover       — dropdowns, tooltips, command palette
bg-primary       — primary action buttons, selected states
bg-foreground    — inverse (selected day in calendar, today indicator)
```

### Status / semantic colors

Do not use Tailwind arbitrary colors for status — use these consistent patterns:

| Status | Background | Text | Ring |
|---|---|---|---|
| Active / Success / Paid | `bg-emerald-500/15` | `text-emerald-700 dark:text-emerald-300` | `ring-emerald-500/30` |
| Warning / Low stock | `bg-amber-500/15` | `text-amber-700 dark:text-amber-300` | `ring-amber-500/30` |
| Info / Sent / Processing | `bg-blue-500/15` | `text-blue-700 dark:text-blue-300` | `ring-blue-500/30` |
| Special / Personal | `bg-violet-500/15` | `text-violet-700 dark:text-violet-300` | `ring-violet-500/30` |
| Destructive / Error / Overdue | use `bg-destructive text-destructive-foreground` or `text-destructive` |

Always pair dark mode variants (`dark:`) when using arbitrary Tailwind colors. Use `ring-1` with the ring color, never `border`.

---

## 5. Component Usage Guidelines

### Button

Import from `@workspace/ui/components/button`.

| Variant | When to use |
|---|---|
| `default` (primary) | Main CTA per page: "Add Customer", "Save Changes" |
| `outline` | Secondary actions: "Export", "Cancel", "Today" nav button |
| `ghost` | Icon-only toolbar actions, sidebar nav items, subtle controls |
| `destructive` | Irreversible delete/remove actions — always in a confirm Dialog |
| `secondary` | Rare — tertiary actions that need more weight than ghost |
| `link` | Inline text links only |

| Size | When to use |
|---|---|
| `default` | Standard buttons in dialogs, forms |
| `sm` | `PageHeader` action buttons, compact toolbars |
| `icon` | Icon-only buttons (must have `aria-label`) |
| `lg` | Auth page primary actions only |

Rules:
- Every `<button>` element that is not a shadcn `Button` must have `type="button"` explicitly
- Icon-only `Button size="icon"` must always have `aria-label`
- Never put `onClick` on a `<div>` — use `<button type="button">` or `Button`

---

### Badge

Import from `@workspace/ui/components/badge`.

| Variant | When to use |
|---|---|
| `default` | Primary status, active state |
| `secondary` | Neutral/muted state (draft, inactive) |
| `outline` | KPI trend indicators in cards, role labels |
| `destructive` | Error/danger status (overdue, cancelled, out of stock) |

For semantic colored statuses (emerald, amber, blue, violet), pass `variant="outline"` and override with `className`:
```tsx
<Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30">
  Active
</Badge>
```

---

### Sheet vs Dialog

| Use `Sheet` when | Use `Dialog` when |
|---|---|
| Create / edit a complex record (many fields) | Short confirmation or simple single-action |
| The form benefits from full vertical space | Form has 1–3 fields max |
| Sliding in feels natural (record detail, profile) | Action is destructive (delete confirm) |
| Content needs scrolling | Content fits in a small centered box |

Sheet always opens from `side="right"` with `sm:max-w-md` (or `sm:max-w-lg` for complex forms).

---

### DataTable

The standard data table uses TanStack Table v9 with tree-shaken features. Reference implementation: `apps/web/src/components/customer-data-table.tsx`.

**Required features setup**:
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

**Import `DataTable` from**:
```ts
import { DataTable, DataTableFacetedFilter } from "@workspace/ui/components/data-table"
```

**Column helper pattern**:
```ts
const columnHelper = createColumnHelper<YourType>()
const columns = [
  columnHelper.display({ id: "select", ... }),      // checkbox
  columnHelper.accessor("field", { ... }),
  columnHelper.display({ id: "actions", ... }),     // row actions
]
```

**Row actions**: always `DropdownMenu` with `IconDotsVertical` trigger, `size="icon" variant="ghost"`.

---

### Card

Import from `@workspace/ui/components/card`. Anatomy:

```tsx
<Card className="@container/card">
  <CardHeader>
    <CardDescription>Label</CardDescription>
    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
      Value
    </CardTitle>
    <CardAction>
      <Badge variant="outline">+12%</Badge>  {/* trend */}
    </CardAction>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">Trend label</div>
    <div className="text-muted-foreground">Supporting context</div>
  </CardFooter>
</Card>
```

KPI card grid: `grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4` — use container queries, not viewport breakpoints.

Cards with gradient (dashboard style):
```
*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card
*:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card
```

---

### Select, Input, Textarea

Import from `@workspace/ui/components/{select,input,textarea}`.

- Always wrap with `Field` + `FieldLabel` from `@workspace/ui/components/field` inside forms
- `Input` default `type="text"` — specify `type` explicitly for email, password, number, search
- `Textarea` for multi-line: add `className="min-h-24 resize-none"` as baseline
- Search inputs: use `IconSearch` prefix inside a relative wrapper, not inside `Input` directly

---

### Tabs

Import from `@workspace/ui/components/tabs`. Use for switching views within the same page (month/week/day in calendar, settings sections, notification filters). Do not use for navigation between routes — use the sidebar for that.

---

## 6. Icon Usage

**Primary library**: `@tabler/icons-react` — all new icons must come from here.

**Existing lucide-react usage**: `app-sidebar.tsx` and `section-cards.tsx` use lucide for some icons. Do not add new lucide imports. When building new components, always use Tabler even if a similar lucide icon already exists elsewhere.

### Naming pattern

All Tabler icons follow `Icon*` prefix:
```tsx
import { IconPlus, IconTrash, IconChevronLeft, IconDotsVertical } from "@tabler/icons-react"
```

### Size conventions

| Context | Class |
|---|---|
| Button icons, inline with text | `size-4` (1rem) |
| Icon-only button, list item prefix | `size-4` or `size-5` |
| Empty state illustration | `size-12` or `size-16`, `text-muted-foreground` |
| Sidebar nav icons (handled by Nav components) | set by component |

### Common icon map

| Action / Concept | Icon |
|---|---|
| Add / Create | `IconPlus` |
| Edit | `IconPencil` |
| Delete | `IconTrash` |
| Close / Remove | `IconX` |
| Search | `IconSearch` |
| Filter | `IconFilter` |
| Sort | `IconArrowsSort` |
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

## 7. Page Layout Patterns

### Standard protected page shell

Every page under `_auth/` must use this exact wrapper structure:

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
- Middle `div`: `@container/main` — enables container queries for all descendants using `@xl/main:`, `@5xl/main:`, etc.
- Inner `div`: vertical rhythm with `gap-4 py-4 md:gap-6 md:py-6`

### PageHeader

```tsx
import { PageHeader } from "@/components/page-header"

<PageHeader
  title="Orders"
  description="Manage and track all customer orders."
  // subtitle="optional — renders uppercase above title"
>
  <Button size="sm">
    <IconPlus className="size-4" />
    Add Order
  </Button>
</PageHeader>
```

`children` appears right-aligned. Use for the primary CTA of the page only.

### Two-column layout with sidebar panel

Used by calendar (`md:flex-row`), messages (always side-by-side at md+):

```tsx
<div className="flex flex-col gap-4 md:flex-row">
  <div className="min-w-0 flex-1">
    {/* Main content */}
  </div>
  <div className="hidden w-60 shrink-0 flex-col gap-4 md:flex">
    {/* Side panel */}
  </div>
</div>
```

### Empty state

Use inside any list or table when there is no data:

```tsx
<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <IconInbox className="size-12 text-muted-foreground/50" />
  <div>
    <p className="text-sm font-medium">No items yet</p>
    <p className="text-sm text-muted-foreground">Create your first item to get started.</p>
  </div>
  <Button size="sm">
    <IconPlus className="size-4" />
    Add Item
  </Button>
</div>
```

### Full-viewport centered (error pages, auth pages)

```tsx
<div className="min-h-svh flex items-center justify-center p-4">
  {/* Content */}
</div>
```

---

## 8. Naming Conventions

### Files

| Type | Pattern | Example |
|---|---|---|
| Route page | `kebab-case.tsx` in `routes/_auth/` | `orders.tsx` |
| App component | `kebab-case.tsx` in `components/` | `order-data-table.tsx` |
| Shared UI primitive | `kebab-case.tsx` in `packages/ui/src/components/` | `data-table.tsx` |
| Data lib | `*-data.ts` in `src/lib/` | `orders-data.ts` |
| Utility lib | descriptive name in `src/lib/` | `date-utils.ts` |
| Route group layout | `_name.tsx` | `_auth.tsx` |

### Components

- Exported components: `PascalCase` function, named export (never default export)
- Internal sub-components within a file: `PascalCase`, not exported
- Props interface: `ComponentNameProps` (e.g. `OrderDataTableProps`)

### Variables & functions

- Regular: `camelCase`
- Constants / static data: `SCREAMING_SNAKE_CASE` for config arrays (e.g. `STATUS_OPTIONS`, `CATEGORY_META`)
- Event handlers: prefix with `handle` (`handleDragEnd`, `handleSubmit`)
- Boolean state: prefix with `is` or `has` (`isOpen`, `hasError`)

### Route IDs

TanStack Router derives route IDs from file paths. The breadcrumb label in `_auth.tsx` is auto-derived via `titleCase()` from the last route segment — name route files with this in mind:
- `orders.tsx` → "Orders"
- `team.tsx` → "Team"
- `file-manager.tsx` → "File Manager"

---

## 9. Mock Data Patterns

All mock data lives in `apps/web/src/lib/*-data.ts`. Follow this structure:

### File anatomy

```ts
// 1. Type definitions first
export type Status = "active" | "inactive"
export type Entity = {
  id: string
  // ...fields
}

// 2. Display metadata (labels, colors, options)
export const STATUS_META: Record<Status, { label: string; chip: string; dot: string }> = {
  active: {
    label: "Active",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
  },
  // ...
}

// 3. Filter options array (for DataTableFacetedFilter)
export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "active", label: "Active" },
  // ...
]

// 4. Static data array
export const initialEntities: Entity[] = [ ... ]

// 5. Pure helper functions
export function filterByStatus(items: Entity[], status: Status): Entity[] {
  return items.filter((i) => i.status === status)
}
```

### ID conventions

| Entity | Format | Example |
|---|---|---|
| Orders | `ORD-NNNN` | `ORD-0042` |
| Products | `PRD-NNN` | `PRD-007` |
| Invoices | `INV-YYYY-NNN` | `INV-2026-012` |
| Team members | `USR-NNN` | `USR-003` |
| Notifications | `notif-N` | `notif-1` |
| Conversations | `conv-N` | `conv-1` |
| Files | `file-N` | `file-12` |

### Date strings

All dates stored as ISO strings (`"yyyy-MM-dd"` for date, `"HH:mm"` for time). Use helpers from `src/lib/date-utils.ts` — never import `date-fns` in `apps/web`.

```ts
import { toIsoDate, addDays } from "@/lib/date-utils"

const today = new Date()
date: toIsoDate(today)
date: toIsoDate(addDays(today, 3))
```

---

## 10. Responsive Design Rules

### Approach

Mobile-first. Base styles target mobile; use breakpoint prefixes to progressively enhance.

### Viewport breakpoints (Tailwind)

| Prefix | Min-width | Primary use |
|---|---|---|
| `sm:` | 640px | Auth forms, sheet widths |
| `md:` | 768px | Show sidebar panels, switch to row layouts |
| `lg:` | 1024px | Wider grid columns |
| `xl:` | 1280px | — (rarely needed, prefer container queries) |

### Container queries (preferred for components)

The `@container/main` on the middle wrapper div enables container-aware grids. **Prefer these over viewport breakpoints** for anything inside the main content area:

| Prefix | Approximate viewport | Used for |
|---|---|---|
| `@xl/main:` | ~640px container | 2-column KPI card grid |
| `@5xl/main:` | ~1024px container | 4-column KPI card grid |
| `@container/card` | inside a card | responsive card title size |
| `@[250px]/card:` | card ≥ 250px | `text-3xl` KPI value |
| `@sm:` | ≥ 384px container | local grid adjustments |

### Sidebar-aware layout

The main content area (`SidebarInset`) shrinks/grows when the sidebar collapses. Use `@container/main` container queries instead of viewport breakpoints so layouts automatically adapt to the available content width.

### Hidden/shown at breakpoints

- Mobile-only items: `md:hidden`
- Desktop-only items: `hidden md:flex` or `hidden md:block`
- The side panel in two-column layouts: `hidden w-60 shrink-0 flex-col gap-4 md:flex`

---

## 11. Accessibility

These are non-negotiable requirements for every component.

### Icon-only buttons

Every `Button size="icon"` (or plain `<button>` with only an icon child) must have `aria-label`:

```tsx
// Correct
<Button variant="ghost" size="icon" aria-label="Previous month" onClick={handlePrev}>
  <IconChevronLeft className="size-4" />
</Button>

// Wrong — missing aria-label
<Button variant="ghost" size="icon" onClick={handlePrev}>
  <IconChevronLeft className="size-4" />
</Button>
```

### Button type attribute

Every `<button>` that is not a submit button must have `type="button"`:

```tsx
// Correct
<button type="button" onClick={handleClick}>...</button>

// Wrong — defaults to type="submit" inside forms, can cause unintended submissions
<button onClick={handleClick}>...</button>
```

### Decorative icons

Icons that are purely decorative (accompany visible text) must have `aria-hidden="true"`:

```tsx
<IconCalendar className="size-4" aria-hidden="true" />
<span>View Calendar</span>
```

### Tabular numbers

Any numeric value that might change (metrics, totals, timestamps, IDs) must have `tabular-nums` to prevent layout shift:

```tsx
<span className="tabular-nums">1,234.56</span>
```

### Semantic HTML

- Use `<h1>` inside `PageHeader` (already handled by the component)
- Section headings inside content: `<h2>` with `text-sm font-medium`
- Data tables: always use `<table>` semantics via the `DataTable` component, never `<div>` grids for tabular data
- Interactive list items: implement as `<button>` or `<a>`, never `<div onClick>`

### Focus management

- Dialogs and Sheets: focus is trapped automatically by shadcn/Radix
- Custom overlays: if building a non-Radix overlay, ensure focus returns to the trigger on close
- DnD keyboard: dnd-kit's `KeyboardSensor` handles keyboard drag — include it alongside `PointerSensor` in all `DndContext` implementations that involve sortable lists (see `kanban.tsx` for reference)
