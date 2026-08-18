// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type OrderItem = {
  productId: string
  name: string
  qty: number
  unitPrice: number
}

export type Order = {
  id: string // "ORD-0001"
  customerId: number
  customerName: string
  customerEmail: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string // ISO date string
  updatedAt: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const STATUS_META: Record<
  OrderStatus,
  { label: string; chip: string }
> = {
  pending: {
    label: "Pending",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
  },
  processing: {
    label: "Processing",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  },
  shipped: {
    label: "Shipped",
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300 dark:ring-violet-400/30",
  },
  delivered: {
    label: "Delivered",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  cancelled: {
    label: "Cancelled",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

// ─── Filter options ───────────────────────────────────────────────────────────

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending",    label: "Pending"    },
  { value: "processing", label: "Processing" },
  { value: "shipped",    label: "Shipped"    },
  { value: "delivered",  label: "Delivered"  },
  { value: "cancelled",  label: "Cancelled"  },
]

// ─── Static data ──────────────────────────────────────────────────────────────

export const initialOrders: Order[] = [
  {
    id: "ORD-0001",
    customerId: 1,
    customerName: "Alice Johnson",
    customerEmail: "alice.johnson@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-001", name: "Wireless Headphones", qty: 1, unitPrice: 89.99 },
      { productId: "PRD-004", name: "USB-C Cable (3-pack)", qty: 2, unitPrice: 12.99 },
    ],
    total: 115.97,
    createdAt: "2026-07-01",
    updatedAt: "2026-07-04",
  },
  {
    id: "ORD-0002",
    customerId: 3,
    customerName: "Carlos Rivera",
    customerEmail: "carlos.rivera@example.com",
    status: "shipped",
    items: [
      { productId: "PRD-002", name: "Mechanical Keyboard", qty: 1, unitPrice: 149.00 },
      { productId: "PRD-007", name: "Mouse Pad XL",        qty: 1, unitPrice: 24.99 },
    ],
    total: 173.99,
    createdAt: "2026-07-10",
    updatedAt: "2026-07-13",
  },
  {
    id: "ORD-0003",
    customerId: 4,
    customerName: "Diana Chen",
    customerEmail: "diana.chen@example.com",
    status: "processing",
    items: [
      { productId: "PRD-003", name: "4K Monitor 27\"", qty: 1, unitPrice: 399.00 },
    ],
    total: 399.00,
    createdAt: "2026-07-14",
    updatedAt: "2026-07-14",
  },
  {
    id: "ORD-0004",
    customerId: 6,
    customerName: "Fatima Al-Hassan",
    customerEmail: "fatima.alhassan@example.com",
    status: "pending",
    items: [
      { productId: "PRD-005", name: "Webcam 1080p",        qty: 1, unitPrice: 79.99 },
      { productId: "PRD-006", name: "Ring Light Kit",      qty: 1, unitPrice: 49.99 },
      { productId: "PRD-009", name: "Laptop Stand",        qty: 1, unitPrice: 34.99 },
    ],
    total: 164.97,
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: "ORD-0005",
    customerId: 7,
    customerName: "George Müller",
    customerEmail: "george.muller@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-010", name: "Ergonomic Chair", qty: 1, unitPrice: 349.00 },
    ],
    total: 349.00,
    createdAt: "2026-06-20",
    updatedAt: "2026-06-25",
  },
  {
    id: "ORD-0006",
    customerId: 10,
    customerName: "Julia Santos",
    customerEmail: "julia.santos@example.com",
    status: "cancelled",
    items: [
      { productId: "PRD-002", name: "Mechanical Keyboard", qty: 2, unitPrice: 149.00 },
    ],
    total: 298.00,
    createdAt: "2026-07-05",
    updatedAt: "2026-07-06",
  },
  {
    id: "ORD-0007",
    customerId: 12,
    customerName: "Laura Bianchi",
    customerEmail: "laura.bianchi@example.com",
    status: "shipped",
    items: [
      { productId: "PRD-008", name: "Desk Organizer Set", qty: 1, unitPrice: 44.99 },
      { productId: "PRD-004", name: "USB-C Cable (3-pack)", qty: 1, unitPrice: 12.99 },
    ],
    total: 57.98,
    createdAt: "2026-07-11",
    updatedAt: "2026-07-13",
  },
  {
    id: "ORD-0008",
    customerId: 13,
    customerName: "Mohammed Al-Rashid",
    customerEmail: "m.alrashid@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-003", name: "4K Monitor 27\"",    qty: 2, unitPrice: 399.00 },
      { productId: "PRD-002", name: "Mechanical Keyboard", qty: 1, unitPrice: 149.00 },
      { productId: "PRD-007", name: "Mouse Pad XL",        qty: 2, unitPrice: 24.99 },
    ],
    total: 996.98,
    createdAt: "2026-06-15",
    updatedAt: "2026-06-22",
  },
  {
    id: "ORD-0009",
    customerId: 15,
    customerName: "Oscar Fernandez",
    customerEmail: "oscar.fernandez@example.com",
    status: "processing",
    items: [
      { productId: "PRD-001", name: "Wireless Headphones", qty: 1, unitPrice: 89.99 },
      { productId: "PRD-005", name: "Webcam 1080p",        qty: 1, unitPrice: 79.99 },
    ],
    total: 169.98,
    createdAt: "2026-07-14",
    updatedAt: "2026-07-14",
  },
  {
    id: "ORD-0010",
    customerId: 16,
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@example.com",
    status: "pending",
    items: [
      { productId: "PRD-009", name: "Laptop Stand",       qty: 2, unitPrice: 34.99 },
      { productId: "PRD-006", name: "Ring Light Kit",     qty: 1, unitPrice: 49.99 },
    ],
    total: 119.97,
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: "ORD-0011",
    customerId: 18,
    customerName: "Rachel Kim",
    customerEmail: "rachel.kim@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-010", name: "Ergonomic Chair",    qty: 1, unitPrice: 349.00 },
      { productId: "PRD-008", name: "Desk Organizer Set", qty: 1, unitPrice: 44.99 },
    ],
    total: 393.99,
    createdAt: "2026-06-28",
    updatedAt: "2026-07-03",
  },
  {
    id: "ORD-0012",
    customerId: 2,
    customerName: "Bob Smith",
    customerEmail: "bob.smith@example.com",
    status: "cancelled",
    items: [
      { productId: "PRD-001", name: "Wireless Headphones", qty: 1, unitPrice: 89.99 },
    ],
    total: 89.99,
    createdAt: "2026-07-02",
    updatedAt: "2026-07-03",
  },
  {
    id: "ORD-0013",
    customerId: 5,
    customerName: "Ethan Williams",
    customerEmail: "ethan.williams@example.com",
    status: "pending",
    items: [
      { productId: "PRD-004", name: "USB-C Cable (3-pack)", qty: 3, unitPrice: 12.99 },
    ],
    total: 38.97,
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: "ORD-0014",
    customerId: 8,
    customerName: "Hannah Park",
    customerEmail: "hannah.park@example.com",
    status: "shipped",
    items: [
      { productId: "PRD-003", name: "4K Monitor 27\"", qty: 1, unitPrice: 399.00 },
    ],
    total: 399.00,
    createdAt: "2026-07-08",
    updatedAt: "2026-07-12",
  },
  {
    id: "ORD-0015",
    customerId: 9,
    customerName: "Ivan Petrov",
    customerEmail: "ivan.petrov@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-007", name: "Mouse Pad XL",     qty: 1, unitPrice: 24.99 },
      { productId: "PRD-009", name: "Laptop Stand",     qty: 1, unitPrice: 34.99 },
    ],
    total: 59.98,
    createdAt: "2026-06-30",
    updatedAt: "2026-07-04",
  },
  {
    id: "ORD-0016",
    customerId: 11,
    customerName: "Kevin O'Brien",
    customerEmail: "kevin.obrien@example.com",
    status: "processing",
    items: [
      { productId: "PRD-002", name: "Mechanical Keyboard", qty: 1, unitPrice: 149.00 },
      { productId: "PRD-001", name: "Wireless Headphones", qty: 1, unitPrice: 89.99 },
    ],
    total: 238.99,
    createdAt: "2026-07-13",
    updatedAt: "2026-07-13",
  },
  {
    id: "ORD-0017",
    customerId: 14,
    customerName: "Nina Kowalski",
    customerEmail: "nina.kowalski@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-006", name: "Ring Light Kit", qty: 1, unitPrice: 49.99 },
      { productId: "PRD-005", name: "Webcam 1080p",   qty: 1, unitPrice: 79.99 },
    ],
    total: 129.98,
    createdAt: "2026-06-10",
    updatedAt: "2026-06-16",
  },
  {
    id: "ORD-0018",
    customerId: 17,
    customerName: "Quinn Taylor",
    customerEmail: "quinn.taylor@example.com",
    status: "pending",
    items: [
      { productId: "PRD-008", name: "Desk Organizer Set", qty: 2, unitPrice: 44.99 },
    ],
    total: 89.98,
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: "ORD-0019",
    customerId: 19,
    customerName: "Samuel Okafor",
    customerEmail: "samuel.okafor@example.com",
    status: "shipped",
    items: [
      { productId: "PRD-004", name: "USB-C Cable (3-pack)", qty: 2, unitPrice: 12.99 },
      { productId: "PRD-007", name: "Mouse Pad XL",          qty: 1, unitPrice: 24.99 },
    ],
    total: 50.97,
    createdAt: "2026-07-09",
    updatedAt: "2026-07-12",
  },
  {
    id: "ORD-0020",
    customerId: 20,
    customerName: "Tina Nguyen",
    customerEmail: "tina.nguyen@example.com",
    status: "delivered",
    items: [
      { productId: "PRD-010", name: "Ergonomic Chair", qty: 1, unitPrice: 349.00 },
      { productId: "PRD-009", name: "Laptop Stand",    qty: 2, unitPrice: 34.99 },
    ],
    total: 418.98,
    createdAt: "2026-06-22",
    updatedAt: "2026-06-28",
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export function computeStats(orders: Order[]) {
  const now = new Date()
  const thisMonth = { year: now.getFullYear(), month: now.getMonth() }

  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.status === "pending").length

  const revenueThisMonth = orders
    .filter((o) => {
      const d = new Date(o.createdAt)
      return (
        d.getFullYear() === thisMonth.year &&
        d.getMonth() === thisMonth.month &&
        o.status !== "cancelled"
      )
    })
    .reduce((sum, o) => sum + o.total, 0)

  const completedOrders = orders.filter((o) => o.status !== "cancelled")
  const avgOrderValue =
    completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length
      : 0

  return { totalOrders, pendingCount, revenueThisMonth, avgOrderValue }
}
