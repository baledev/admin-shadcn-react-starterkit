// ─── Types ────────────────────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

export type InvoiceLine = {
  description: string
  qty: number
  unitPrice: number
}

export type Invoice = {
  id: string // "INV-2026-001"
  customerId: number
  customerName: string
  customerEmail: string
  status: InvoiceStatus
  lines: InvoiceLine[]
  subtotal: number
  tax: number
  total: number
  issuedAt: string // ISO date string
  dueAt: string
  notes?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const STATUS_META: Record<
  InvoiceStatus,
  { label: string; chip: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  sent: {
    label: "Sent",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  },
  paid: {
    label: "Paid",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  overdue: {
    label: "Overdue",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

// ─── Filter options ───────────────────────────────────────────────────────────

export const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
]

// ─── Static data ──────────────────────────────────────────────────────────────

export const initialInvoices: Invoice[] = [
  {
    id: "INV-2026-001",
    customerId: 1,
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    status: "paid",
    lines: [
      { description: "Website Design", qty: 1, unitPrice: 1200.0 },
      { description: "SEO Audit", qty: 1, unitPrice: 350.0 },
    ],
    subtotal: 1550.0,
    tax: 155.0,
    total: 1705.0,
    issuedAt: "2026-01-05",
    dueAt: "2026-01-20",
    notes: "Thank you for your business!",
  },
  {
    id: "INV-2026-002",
    customerId: 2,
    customerName: "Bob Martinez",
    customerEmail: "bob@example.com",
    status: "overdue",
    lines: [
      { description: "Backend Development (40h)", qty: 40, unitPrice: 95.0 },
    ],
    subtotal: 3800.0,
    tax: 380.0,
    total: 4180.0,
    issuedAt: "2026-01-10",
    dueAt: "2026-01-25",
  },
  {
    id: "INV-2026-003",
    customerId: 3,
    customerName: "Carol White",
    customerEmail: "carol@example.com",
    status: "sent",
    lines: [
      { description: "UI/UX Consultation", qty: 8, unitPrice: 120.0 },
      { description: "Prototype Delivery", qty: 1, unitPrice: 400.0 },
    ],
    subtotal: 1360.0,
    tax: 136.0,
    total: 1496.0,
    issuedAt: "2026-01-18",
    dueAt: "2026-02-02",
  },
  {
    id: "INV-2026-004",
    customerId: 4,
    customerName: "David Lee",
    customerEmail: "david@example.com",
    status: "draft",
    lines: [
      { description: "Monthly Retainer - Feb", qty: 1, unitPrice: 2500.0 },
    ],
    subtotal: 2500.0,
    tax: 250.0,
    total: 2750.0,
    issuedAt: "2026-02-01",
    dueAt: "2026-02-15",
    notes: "Retainer for ongoing support services.",
  },
  {
    id: "INV-2026-005",
    customerId: 5,
    customerName: "Eva Chen",
    customerEmail: "eva@example.com",
    status: "paid",
    lines: [
      { description: "Logo Design", qty: 1, unitPrice: 600.0 },
      { description: "Brand Guidelines", qty: 1, unitPrice: 800.0 },
      { description: "Social Media Kit", qty: 1, unitPrice: 300.0 },
    ],
    subtotal: 1700.0,
    tax: 170.0,
    total: 1870.0,
    issuedAt: "2026-02-05",
    dueAt: "2026-02-20",
  },
  {
    id: "INV-2026-006",
    customerId: 6,
    customerName: "Frank Müller",
    customerEmail: "frank@example.com",
    status: "sent",
    lines: [
      { description: "E-commerce Integration", qty: 1, unitPrice: 3200.0 },
      { description: "Payment Gateway Setup", qty: 1, unitPrice: 450.0 },
    ],
    subtotal: 3650.0,
    tax: 365.0,
    total: 4015.0,
    issuedAt: "2026-02-12",
    dueAt: "2026-02-27",
  },
  {
    id: "INV-2026-007",
    customerId: 7,
    customerName: "Grace Kim",
    customerEmail: "grace@example.com",
    status: "overdue",
    lines: [
      {
        description: "Content Writing (10 articles)",
        qty: 10,
        unitPrice: 150.0,
      },
    ],
    subtotal: 1500.0,
    tax: 150.0,
    total: 1650.0,
    issuedAt: "2026-01-28",
    dueAt: "2026-02-12",
    notes: "Articles delivered on 2026-01-27.",
  },
  {
    id: "INV-2026-008",
    customerId: 8,
    customerName: "Henry Park",
    customerEmail: "henry@example.com",
    status: "paid",
    lines: [
      { description: "Mobile App Development", qty: 1, unitPrice: 8500.0 },
      { description: "App Store Submission", qty: 1, unitPrice: 200.0 },
    ],
    subtotal: 8700.0,
    tax: 870.0,
    total: 9570.0,
    issuedAt: "2026-02-20",
    dueAt: "2026-03-06",
  },
  {
    id: "INV-2026-009",
    customerId: 9,
    customerName: "Isla Roberts",
    customerEmail: "isla@example.com",
    status: "draft",
    lines: [{ description: "Data Analysis Report", qty: 1, unitPrice: 950.0 }],
    subtotal: 950.0,
    tax: 95.0,
    total: 1045.0,
    issuedAt: "2026-03-01",
    dueAt: "2026-03-16",
  },
  {
    id: "INV-2026-010",
    customerId: 10,
    customerName: "Jake Thompson",
    customerEmail: "jake@example.com",
    status: "sent",
    lines: [
      { description: "Cloud Infrastructure Setup", qty: 1, unitPrice: 1800.0 },
      { description: "DevOps Consulting (12h)", qty: 12, unitPrice: 110.0 },
    ],
    subtotal: 3120.0,
    tax: 312.0,
    total: 3432.0,
    issuedAt: "2026-03-05",
    dueAt: "2026-03-20",
    notes: "AWS and Vercel configuration included.",
  },
  {
    id: "INV-2026-011",
    customerId: 11,
    customerName: "Karen Nguyen",
    customerEmail: "karen@example.com",
    status: "paid",
    lines: [
      { description: "Graphic Design (5 assets)", qty: 5, unitPrice: 220.0 },
    ],
    subtotal: 1100.0,
    tax: 110.0,
    total: 1210.0,
    issuedAt: "2026-03-10",
    dueAt: "2026-03-25",
  },
  {
    id: "INV-2026-012",
    customerId: 12,
    customerName: "Liam Foster",
    customerEmail: "liam@example.com",
    status: "overdue",
    lines: [
      { description: "Video Production", qty: 1, unitPrice: 2200.0 },
      { description: "Video Editing", qty: 1, unitPrice: 800.0 },
    ],
    subtotal: 3000.0,
    tax: 300.0,
    total: 3300.0,
    issuedAt: "2026-02-15",
    dueAt: "2026-03-01",
    notes: "Rush turnaround requested by client.",
  },
  {
    id: "INV-2026-013",
    customerId: 13,
    customerName: "Mia Santos",
    customerEmail: "mia@example.com",
    status: "sent",
    lines: [
      { description: "Email Marketing Campaign", qty: 1, unitPrice: 750.0 },
      { description: "Template Design", qty: 3, unitPrice: 150.0 },
    ],
    subtotal: 1200.0,
    tax: 120.0,
    total: 1320.0,
    issuedAt: "2026-03-15",
    dueAt: "2026-03-30",
  },
  {
    id: "INV-2026-014",
    customerId: 14,
    customerName: "Noah Williams",
    customerEmail: "noah@example.com",
    status: "draft",
    lines: [
      { description: "Security Audit", qty: 1, unitPrice: 1600.0 },
      { description: "Penetration Testing", qty: 1, unitPrice: 900.0 },
    ],
    subtotal: 2500.0,
    tax: 250.0,
    total: 2750.0,
    issuedAt: "2026-03-20",
    dueAt: "2026-04-04",
  },
  {
    id: "INV-2026-015",
    customerId: 15,
    customerName: "Olivia Brown",
    customerEmail: "olivia@example.com",
    status: "paid",
    lines: [
      { description: "WordPress Development", qty: 1, unitPrice: 2100.0 },
      { description: "Plugin Customisation", qty: 2, unitPrice: 350.0 },
    ],
    subtotal: 2800.0,
    tax: 280.0,
    total: 3080.0,
    issuedAt: "2026-03-25",
    dueAt: "2026-04-09",
    notes: "Includes 6 months of hosting.",
  },
  {
    id: "INV-2026-016",
    customerId: 16,
    customerName: "Peter Davis",
    customerEmail: "peter@example.com",
    status: "sent",
    lines: [
      {
        description: "Product Photography (20 shots)",
        qty: 20,
        unitPrice: 45.0,
      },
    ],
    subtotal: 900.0,
    tax: 90.0,
    total: 990.0,
    issuedAt: "2026-04-01",
    dueAt: "2026-04-16",
  },
  {
    id: "INV-2026-017",
    customerId: 17,
    customerName: "Quinn Taylor",
    customerEmail: "quinn@example.com",
    status: "overdue",
    lines: [
      { description: "API Integration (Stripe)", qty: 1, unitPrice: 1400.0 },
    ],
    subtotal: 1400.0,
    tax: 140.0,
    total: 1540.0,
    issuedAt: "2026-03-05",
    dueAt: "2026-03-20",
    notes: "Integration completed and deployed to production.",
  },
  {
    id: "INV-2026-018",
    customerId: 18,
    customerName: "Rachel Green",
    customerEmail: "rachel@example.com",
    status: "paid",
    lines: [
      { description: "Training Workshop (4h)", qty: 4, unitPrice: 200.0 },
      { description: "Training Materials", qty: 1, unitPrice: 150.0 },
    ],
    subtotal: 950.0,
    tax: 95.0,
    total: 1045.0,
    issuedAt: "2026-04-05",
    dueAt: "2026-04-20",
  },
  {
    id: "INV-2026-019",
    customerId: 19,
    customerName: "Sam Wilson",
    customerEmail: "sam@example.com",
    status: "draft",
    lines: [
      { description: "Dashboard Development", qty: 1, unitPrice: 4500.0 },
      { description: "Data Visualisation", qty: 1, unitPrice: 1200.0 },
    ],
    subtotal: 5700.0,
    tax: 570.0,
    total: 6270.0,
    issuedAt: "2026-04-10",
    dueAt: "2026-04-25",
  },
  {
    id: "INV-2026-020",
    customerId: 20,
    customerName: "Tina Lopez",
    customerEmail: "tina@example.com",
    status: "sent",
    lines: [
      { description: "Copywriting (5 pages)", qty: 5, unitPrice: 180.0 },
      { description: "Proofreading", qty: 1, unitPrice: 120.0 },
    ],
    subtotal: 1020.0,
    tax: 102.0,
    total: 1122.0,
    issuedAt: "2026-04-15",
    dueAt: "2026-04-30",
    notes: "Final copies delivered via Google Docs.",
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export function computeInvoiceStats(invoices: Invoice[]) {
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const paid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0)
  const outstanding = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "draft")
    .reduce((sum, inv) => sum + inv.total, 0)
  const overdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0)
  return { totalInvoiced, paid, outstanding, overdue }
}
