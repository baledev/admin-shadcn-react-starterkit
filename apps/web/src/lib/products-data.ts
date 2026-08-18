// ─── Types ────────────────────────────────────────────────────────────────────

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "food"
  | "books"
  | "other"

export type Product = {
  id: string // "PRD-001"
  name: string
  sku: string
  category: ProductCategory
  price: number
  stock: number
  stockStatus: StockStatus
  imageUrl?: string
  description?: string
  createdAt: string // ISO date string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const STOCK_STATUS_META: Record<
  StockStatus,
  { label: string; chip: string }
> = {
  in_stock: {
    label: "In Stock",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  low_stock: {
    label: "Low Stock",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
  },
  out_of_stock: {
    label: "Out of Stock",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const CATEGORY_META: Record<ProductCategory, { label: string }> = {
  electronics: { label: "Electronics" },
  clothing: { label: "Clothing" },
  food: { label: "Food" },
  books: { label: "Books" },
  other: { label: "Other" },
}

// ─── Filter options ───────────────────────────────────────────────────────────

export const STOCK_STATUS_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
]

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food" },
  { value: "books", label: "Books" },
  { value: "other", label: "Other" },
]

// ─── Static data ──────────────────────────────────────────────────────────────

export const initialProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Wireless Headphones",
    sku: "WH-BT500",
    category: "electronics",
    price: 89.99,
    stock: 142,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop&auto=format",
    description:
      "Premium Bluetooth headphones with active noise cancellation and 30-hour battery life.",
    createdAt: "2025-11-01",
  },
  {
    id: "PRD-002",
    name: "Mechanical Keyboard",
    sku: "KB-MX-TKL",
    category: "electronics",
    price: 149.0,
    stock: 58,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=64&h=64&fit=crop&auto=format",
    description: "Tenkeyless mechanical keyboard with Cherry MX Blue switches.",
    createdAt: "2025-11-05",
  },
  {
    id: "PRD-003",
    name: '4K Monitor 27"',
    sku: "MON-4K-27",
    category: "electronics",
    price: 399.0,
    stock: 23,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a573d5f5c6?w=64&h=64&fit=crop&auto=format",
    description:
      "27-inch 4K UHD IPS display with USB-C connectivity and 144Hz refresh rate.",
    createdAt: "2025-11-10",
  },
  {
    id: "PRD-004",
    name: "USB-C Cable (3-pack)",
    sku: "CAB-USBC-3PK",
    category: "electronics",
    price: 12.99,
    stock: 5,
    stockStatus: "low_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=64&h=64&fit=crop&auto=format",
    description: "Braided nylon USB-C cables, 6-foot length, 3-pack.",
    createdAt: "2025-12-01",
  },
  {
    id: "PRD-005",
    name: "Webcam 1080p",
    sku: "CAM-HD-1080",
    category: "electronics",
    price: 79.99,
    stock: 31,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1596007751476-5aa7cce5e7e7?w=64&h=64&fit=crop&auto=format",
    description: "Full HD webcam with built-in stereo microphone and auto-focus.",
    createdAt: "2025-12-05",
  },
  {
    id: "PRD-006",
    name: "Ring Light Kit",
    sku: "LIGHT-RING-18",
    category: "other",
    price: 49.99,
    stock: 19,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=64&h=64&fit=crop&auto=format",
    description: "18-inch LED ring light with tripod stand and phone holder.",
    createdAt: "2025-12-10",
  },
  {
    id: "PRD-007",
    name: "Mouse Pad XL",
    sku: "MP-XL-900",
    category: "other",
    price: 24.99,
    stock: 0,
    stockStatus: "out_of_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=64&h=64&fit=crop&auto=format",
    description:
      "900×400mm extended desk mat with non-slip rubber base and stitched edges.",
    createdAt: "2025-12-12",
  },
  {
    id: "PRD-008",
    name: "Desk Organizer Set",
    sku: "ORG-DESK-5PC",
    category: "other",
    price: 44.99,
    stock: 67,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=64&h=64&fit=crop&auto=format",
    description: "5-piece bamboo desk organizer set with pen holder and tray.",
    createdAt: "2025-12-15",
  },
  {
    id: "PRD-009",
    name: "Laptop Stand",
    sku: "STD-LAP-ALU",
    category: "electronics",
    price: 34.99,
    stock: 4,
    stockStatus: "low_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=64&h=64&fit=crop&auto=format",
    description:
      "Adjustable aluminium laptop stand compatible with 10–16 inch laptops.",
    createdAt: "2026-01-08",
  },
  {
    id: "PRD-010",
    name: "Ergonomic Chair",
    sku: "CHAIR-ERG-PRO",
    category: "other",
    price: 349.0,
    stock: 12,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=64&h=64&fit=crop&auto=format",
    description:
      "Fully adjustable ergonomic office chair with lumbar support and mesh back.",
    createdAt: "2026-01-15",
  },
  {
    id: "PRD-011",
    name: "Running Jacket",
    sku: "CLO-RUN-JKT-M",
    category: "clothing",
    price: 95.0,
    stock: 38,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1556906781-9a412961a6f6?w=64&h=64&fit=crop&auto=format",
    description:
      "Lightweight wind-resistant running jacket with reflective strips.",
    createdAt: "2026-01-20",
  },
  {
    id: "PRD-012",
    name: "Merino Wool Sweater",
    sku: "CLO-WOOL-SWT-L",
    category: "clothing",
    price: 120.0,
    stock: 0,
    stockStatus: "out_of_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=64&h=64&fit=crop&auto=format",
    description:
      "100% merino wool crew neck sweater, machine washable, size L.",
    createdAt: "2026-02-01",
  },
  {
    id: "PRD-013",
    name: "Organic Coffee Beans",
    sku: "FOOD-COFFEE-500G",
    category: "food",
    price: 18.5,
    stock: 200,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=64&h=64&fit=crop&auto=format",
    description:
      "Single-origin Ethiopian Yirgacheffe whole bean coffee, 500g bag.",
    createdAt: "2026-02-10",
  },
  {
    id: "PRD-014",
    name: "Protein Powder (Vanilla)",
    sku: "FOOD-PROT-VAN-1KG",
    category: "food",
    price: 39.99,
    stock: 7,
    stockStatus: "low_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=64&h=64&fit=crop&auto=format",
    description:
      "Whey protein isolate, vanilla flavour, 1kg. 25g protein per serving.",
    createdAt: "2026-02-15",
  },
  {
    id: "PRD-015",
    name: "The Pragmatic Programmer",
    sku: "BOOK-PRAGPROG-2E",
    category: "books",
    price: 49.95,
    stock: 55,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=64&h=64&fit=crop&auto=format",
    description:
      "20th Anniversary Edition — your journey to mastery, by Hunt & Thomas.",
    createdAt: "2026-03-01",
  },
  {
    id: "PRD-016",
    name: "Clean Code",
    sku: "BOOK-CLEANCODE",
    category: "books",
    price: 39.95,
    stock: 33,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=64&h=64&fit=crop&auto=format",
    description: "A handbook of agile software craftsmanship by Robert C. Martin.",
    createdAt: "2026-03-05",
  },
  {
    id: "PRD-017",
    name: "Portable SSD 1TB",
    sku: "SSD-USB-1TB",
    category: "electronics",
    price: 109.99,
    stock: 0,
    stockStatus: "out_of_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1601737487795-dab272f52420?w=64&h=64&fit=crop&auto=format",
    description:
      "1TB USB 3.2 Gen 2 portable solid-state drive, up to 1050 MB/s read.",
    createdAt: "2026-03-10",
  },
  {
    id: "PRD-018",
    name: "Yoga Mat",
    sku: "OTH-YOGAMAT-6MM",
    category: "other",
    price: 32.0,
    stock: 84,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=64&h=64&fit=crop&auto=format",
    description: "6mm non-slip TPE yoga mat with carrying strap, 183×61cm.",
    createdAt: "2026-03-15",
  },
  {
    id: "PRD-019",
    name: "Linen Trousers",
    sku: "CLO-LIN-TRS-32",
    category: "clothing",
    price: 68.0,
    stock: 3,
    stockStatus: "low_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4c2c14?w=64&h=64&fit=crop&auto=format",
    description:
      "Relaxed-fit linen trousers with drawstring waist, waist size 32.",
    createdAt: "2026-04-01",
  },
  {
    id: "PRD-020",
    name: "Smart Water Bottle",
    sku: "OTH-H2O-SMART",
    category: "other",
    price: 28.0,
    stock: 110,
    stockStatus: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=64&h=64&fit=crop&auto=format",
    description:
      "Insulated smart bottle with LED hydration reminder and temperature display.",
    createdAt: "2026-04-10",
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export function computeProductStats(products: Product[]) {
  const totalProducts = products.length
  const lowStockCount = products.filter(
    (p) => p.stockStatus === "low_stock"
  ).length
  const outOfStockCount = products.filter(
    (p) => p.stockStatus === "out_of_stock"
  ).length
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  )
  return { totalProducts, lowStockCount, outOfStockCount, totalInventoryValue }
}

export function deriveStockStatus(stock: number): StockStatus {
  if (stock === 0) return "out_of_stock"
  if (stock <= 10) return "low_stock"
  return "in_stock"
}
