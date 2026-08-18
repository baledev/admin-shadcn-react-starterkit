# Roadmap

Feature roadmap for the admin dashboard starter kit. Organized into phases by priority. Each phase is independently shippable — complete Phase 1 before starting Phase 2.

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Routing**: TanStack Router (file-based, `apps/web/src/routes/`)
- **UI**: shadcn/ui (`base-vega` style) via `@workspace/ui`
- **Styling**: Tailwind v4, design tokens in `packages/ui/src/styles/globals.css`
- **Tables**: TanStack Table v9 (tree-shaken features)
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts
- **Icons**: Tabler Icons (`@tabler/icons-react`)
- **Auth**: mocked (`src/lib/auth.ts`) — replace with real backend

---

## Current State

Pages already implemented:

| Route | File | Description |
|---|---|---|
| `/dashboard` | `_auth/dashboard.tsx` | KPI cards, area chart, data table |
| `/customers` | `_auth/customers.tsx` | Full CRUD data table with filters, Sheet form |
| `/kanban` | `_auth/kanban.tsx` | Drag-and-drop kanban board with dnd-kit |
| `/calendar` | `_auth/calendar.tsx` | Month/week/day views, mini calendar, DnD activities |
| `/settings` | `_auth/settings.tsx` | Profile, account, notifications, billing sections |
| `/sign-in` | `_guest/sign-in.tsx` | Auth form, mocked login |
| `/sign-up` | `_guest/sign-up.tsx` | Registration form |
| `/forgot-password` | `_guest/forgot-password.tsx` | Password reset request |
| `/reset-password` | `_guest/reset-password.tsx` | Password reset confirmation |

---

## Phase 1 — Core Commerce

The most commonly needed pages in any admin for a business. All three share similar patterns: `DataTable` as the primary UI, `Sheet` for create/edit, `Badge` for status.

### 1.1 Orders

**Route**: `/_auth/orders`
**File**: `apps/web/src/routes/_auth/orders.tsx`
**Sidebar**: `IconShoppingCart` — "Orders"

**Description**: List of all orders with filterable status, sortable by date/amount, row actions to view detail. A detail `Sheet` slides in from the right showing order line items.

**Key UI components**:
- `PageHeader` with title "Orders" and "Export" button (`Button variant="outline"`)
- `DataTable` (TanStack Table v9, same pattern as `customer-data-table.tsx`)
- `DataTableFacetedFilter` for status: `pending | processing | shipped | delivered | cancelled`
- `Badge` for status with semantic color per status
- `Sheet` (right side) for order detail: line items list, totals, customer info, timeline

**Mock data shape** (`src/lib/orders-data.ts`):
```ts
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type OrderItem = {
  productId: string
  name: string
  qty: number
  unitPrice: number
}

export type Order = {
  id: string           // "ORD-0001"
  customerId: number
  customerName: string
  customerEmail: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string    // ISO date string
  updatedAt: string
}
```

**Stat cards** (above table): Total Orders, Pending, Revenue This Month, Avg Order Value

---

### 1.2 Products / Inventory

**Route**: `/_auth/products`
**File**: `apps/web/src/routes/_auth/products.tsx`
**Sidebar**: `IconPackage` — "Products"

**Description**: Product catalog with stock levels, categories, pricing. `Sheet` for add/edit product. Stock level shown as colored badge (low/ok/out).

**Key UI components**:
- `PageHeader` with "Add Product" button (`Button size="sm"`)
- `DataTable` with image thumbnail column (avatar-like `<img>` with rounded corners)
- `DataTableFacetedFilter` for category and stock status
- `Sheet` for add/edit: fields for name, SKU, category, price, stock qty, description
- `Badge` for stock: `out` = destructive, `low` = amber, `ok` = emerald (use ring-1 pattern from activity chips)

**Mock data shape** (`src/lib/products-data.ts`):
```ts
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"
export type ProductCategory = "electronics" | "clothing" | "food" | "books" | "other"

export type Product = {
  id: string           // "PRD-001"
  name: string
  sku: string
  category: ProductCategory
  price: number
  stock: number
  stockStatus: StockStatus
  imageUrl?: string
  description?: string
  createdAt: string
}
```

**Stat cards**: Total Products, Low Stock, Out of Stock, Total Inventory Value

---

### 1.3 Invoices

**Route**: `/_auth/invoices`
**File**: `apps/web/src/routes/_auth/invoices.tsx`
**Sidebar**: `IconReceipt` — "Invoices"

**Description**: Invoice list with status (draft/sent/paid/overdue). Click row opens a read-only invoice preview in a `Sheet`. "Download PDF" is a stub button.

**Key UI components**:
- `PageHeader` with "New Invoice" button
- `DataTable`: invoice number, customer, issue date, due date, amount, status
- `Badge` for status: `draft` = secondary, `sent` = blue, `paid` = emerald, `overdue` = destructive
- `Sheet` for invoice preview — structured layout: header with logo placeholder, bill-to section, line items table, totals, notes
- `Button variant="outline"` for "Download PDF" (stub `onClick`)

**Mock data shape** (`src/lib/invoices-data.ts`):
```ts
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

export type InvoiceLine = {
  description: string
  qty: number
  unitPrice: number
}

export type Invoice = {
  id: string           // "INV-2026-001"
  customerId: number
  customerName: string
  customerEmail: string
  status: InvoiceStatus
  lines: InvoiceLine[]
  subtotal: number
  tax: number
  total: number
  issuedAt: string
  dueAt: string
  notes?: string
}
```

**Stat cards**: Total Invoiced, Paid, Outstanding, Overdue

---

## Phase 2 — People & Communication

Pages centered on internal users and communication. Lower data complexity than Phase 1 but require more composition of shadcn primitives.

### 2.1 Team / Users

**Route**: `/_auth/team`
**File**: `apps/web/src/routes/_auth/team.tsx`
**Sidebar**: `IconUsers` — "Team"

**Description**: Internal user management — invite members, assign roles, deactivate accounts. Distinct from `/customers` (external users). Uses `Avatar` prominently.

**Key UI components**:
- `PageHeader` with "Invite Member" button → `Dialog` (not Sheet, since it's a short form)
- `DataTable`: avatar + name, email, role badge, status, last active, row actions
- `DropdownMenu` row actions: Edit Role, Deactivate, Remove
- `Dialog` for invite: email input + role `Select`
- `Badge` for role: `owner` (primary), `admin` (secondary), `member` (outline), `viewer` (ghost-like muted)
- `Avatar` + `AvatarFallback` with initials for users without photo

**Mock data shape** (`src/lib/team-data.ts`):
```ts
export type TeamRole = "owner" | "admin" | "member" | "viewer"
export type MemberStatus = "active" | "invited" | "deactivated"

export type TeamMember = {
  id: string
  name: string
  email: string
  role: TeamRole
  status: MemberStatus
  avatarUrl?: string
  lastActiveAt: string
  joinedAt: string
}
```

---

### 2.2 Notifications

**Route**: `/_auth/notifications`
**File**: `apps/web/src/routes/_auth/notifications.tsx`
**Sidebar**: `IconBell` — "Notifications"

**Description**: Full-page notification inbox (complements the popover `NotificationsBlock` in the header). Supports mark-as-read, filter by type, bulk clear.

**Key UI components**:
- `PageHeader` with "Mark All Read" button (`Button variant="outline"`)
- Filter tabs (using shadcn `Tabs`): All | Unread | System | Activity
- Notification list — each row: icon (category-colored), title, description, timestamp, unread dot, "Mark read" action
- Empty state: centered icon + text when all read
- No `DataTable` here — use a plain `div` list with `divide-y divide-border`

**Mock data shape** (`src/lib/notifications-data.ts`):
```ts
export type NotificationType = "system" | "activity" | "billing" | "security"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  description: string
  read: boolean
  createdAt: string
  actionUrl?: string
}
```

---

### 2.3 Messages / Inbox

**Route**: `/_auth/messages`
**File**: `apps/web/src/routes/_auth/messages.tsx`
**Sidebar**: `IconMessage` — "Messages"

**Description**: Two-panel layout — conversation list on left, message thread on right. Mocked internal messaging (support-ticket style).

**Key UI components**:
- Two-column layout: `w-80 shrink-0` list panel + `flex-1` thread panel (same pattern as email clients)
- Conversation list: `Avatar`, sender name, preview text, timestamp, unread count `Badge`
- Thread panel: scrollable message bubbles, composer `Textarea` + send `Button` at bottom
- Message bubble: right-aligned (current user, `bg-primary text-primary-foreground`), left-aligned (others, `bg-muted`)
- Empty state in thread panel when no conversation selected

**Mock data shape** (`src/lib/messages-data.ts`):
```ts
export type Message = {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  body: string
  sentAt: string
  isOwn: boolean       // true = current user
}

export type Conversation = {
  id: string
  participantName: string
  participantAvatar?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}
```

---

## Phase 3 — Power Features

Heavier pages requiring chart composition and file system concepts. Build after Phases 1 & 2 are complete.

### 3.1 Analytics / Reports

**Route**: `/_auth/analytics`
**File**: `apps/web/src/routes/_auth/analytics.tsx`
**Sidebar**: `IconChartBar` — "Analytics"

**Description**: Dedicated analytics page — deeper than the dashboard summary. Date range selector, multiple chart types, exportable tables.

**Key UI components**:
- `PageHeader` with date range picker (`Calendar` in a `Popover`, range mode)
- Stat cards row: same `SectionCards` pattern but analytics-specific metrics
- **Chart composition** (all Recharts, wrap in shadcn `Card`):
  - `AreaChart` — revenue over time (reuse `ChartAreaInteractive` pattern)
  - `BarChart` — orders by day of week
  - `PieChart` / `RadialBarChart` — traffic source breakdown
  - `LineChart` — customer acquisition vs churn
- Export button: "Export CSV" stub
- Charts use `chart-1` through `chart-5` CSS variables for colors (never hardcode hex)

**Mock data shape** (`src/lib/analytics-data.ts`):
```ts
export type DailyMetric = {
  date: string         // "yyyy-MM-dd"
  revenue: number
  orders: number
  newCustomers: number
  returningCustomers: number
}

export type TrafficSource = {
  source: string       // "Organic", "Paid", "Referral", etc.
  sessions: number
  percentage: number
}
```

---

### 3.2 File Manager

**Route**: `/_auth/files`
**File**: `apps/web/src/routes/_auth/files.tsx`
**Sidebar**: `IconFolder` — "Files"

**Description**: Grid/list toggle view of files and folders. Upload stub, rename, delete actions. No real backend — files stored in local state.

**Key UI components**:
- `PageHeader` with "Upload" button + grid/list toggle (`Button variant="outline" size="icon"`)
- Breadcrumb for current folder path (reuse shadcn `Breadcrumb`)
- **Grid view**: `grid grid-cols-2 @sm:grid-cols-3 @lg:grid-cols-5` — each item: file type icon (large, colored by type), name, size
- **List view**: `DataTable`-style with columns: name, type, size, modified date, actions
- `DropdownMenu` per item: Rename, Download (stub), Delete
- `Dialog` for rename: single `Input` field
- File type icons: use Tabler `IconFileTypePdf`, `IconFileTypeJpg`, `IconFolder`, `IconFileTypeDoc`, etc.
- Empty state per folder

**Mock data shape** (`src/lib/files-data.ts`):
```ts
export type FileType = "folder" | "pdf" | "image" | "doc" | "spreadsheet" | "other"

export type FileItem = {
  id: string
  name: string
  type: FileType
  size?: number        // bytes, undefined for folders
  modifiedAt: string
  parentId: string | null
}
```

---

## Phase 4 — Polish

Small but important pages that complete the UX of the template.

### 4.1 Profile

**Route**: `/_auth/profile`
**File**: `apps/web/src/routes/_auth/profile.tsx`
**Sidebar**: none — accessible from `NavUser` dropdown ("View Profile")

**Description**: Dedicated profile page for the logged-in user. More visual than Settings. Shows avatar prominently, activity summary, editable fields.

**Key UI components**:
- Hero section: large `Avatar` (size-24), name, email, role badge, "Edit Profile" button
- Two-column layout at `md:` breakpoint: profile details left, activity/stats right
- Editable fields in a `Card`: name, email, bio, timezone `Select`, language `Select`
- Activity feed: recent actions list (mocked)
- Uses `auth.user` from router context for initial values

---

### 4.2 Error Pages

**Routes & files**:
- `apps/web/src/routes/404.tsx` → catches unmatched routes via TanStack Router `notFoundComponent`
- `apps/web/src/routes/error.tsx` → `errorComponent` on `__root.tsx`

**Key UI components**:
- Full-viewport centered layout (`min-h-svh flex items-center justify-center`)
- Large error code in muted, oversized font (`text-8xl font-bold text-muted-foreground/20`)
- Title + short description
- "Go to Dashboard" (`Button`) + "Go back" (`Button variant="outline"`)
- No sidebar — these render outside `_auth` layout

---

## Sidebar Navigation Plan

When implementing new pages, update `apps/web/src/components/app-sidebar.tsx` `navMain` array. All icons from `@tabler/icons-react`.

```ts
// Phase 1 additions
{ title: "Orders",    url: "/orders",    icon: <IconShoppingCart /> }
{ title: "Products",  url: "/products",  icon: <IconPackage /> }
{ title: "Invoices",  url: "/invoices",  icon: <IconReceipt /> }

// Phase 2 additions
{ title: "Team",          url: "/team",          icon: <IconUsers /> }
{ title: "Notifications", url: "/notifications", icon: <IconBell /> }
{ title: "Messages",      url: "/messages",      icon: <IconMessage /> }

// Phase 3 additions
{ title: "Analytics", url: "/analytics", icon: <IconChartBar /> }
{ title: "Files",     url: "/files",     icon: <IconFolder /> }
```

Profile (Phase 4) is accessed via the `NavUser` dropdown — no sidebar entry needed.
Error pages (Phase 4) are framework-level — no sidebar entry.
