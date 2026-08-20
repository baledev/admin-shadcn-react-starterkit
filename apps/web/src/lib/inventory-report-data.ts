export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  stockLevel: number
  reorderPoint: number
  unitCost: number
  totalValue: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export interface InventorySummary {
  totalSKUs: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  items: InventoryItem[]
}

export const initialInventoryReport: InventorySummary = {
  totalSKUs: 5,
  totalValue: 335000000,
  lowStockItems: 2,
  outOfStockItems: 1,
  items: [
    {
      id: "PRD-001",
      sku: "SKU-MBP-M3",
      name: "MacBook Pro M3",
      category: "Laptops",
      stockLevel: 15,
      reorderPoint: 5,
      unitCost: 18000000,
      totalValue: 270000000,
      status: "in_stock",
    },
    {
      id: "PRD-002",
      sku: "SKU-IPH-15",
      name: "iPhone 15 Pro",
      category: "Phones",
      stockLevel: 4,
      reorderPoint: 5,
      unitCost: 12000000,
      totalValue: 48000000,
      status: "low_stock",
    },
    {
      id: "PRD-003",
      sku: "SKU-MGK-01",
      name: "Magic Keyboard",
      category: "Accessories",
      stockLevel: 12,
      reorderPoint: 3,
      unitCost: 1000000,
      totalValue: 12000000,
      status: "in_stock",
    },
    {
      id: "PRD-004",
      sku: "SKU-MGS-02",
      name: "Magic Mouse 2",
      category: "Accessories",
      stockLevel: 2,
      reorderPoint: 5,
      unitCost: 2500000,
      totalValue: 5000000,
      status: "low_stock",
    },
    {
      id: "PRD-005",
      sku: "SKU-USB-C",
      name: "USB-C to Lightning Cable",
      category: "Cables",
      stockLevel: 0,
      reorderPoint: 10,
      unitCost: 350000,
      totalValue: 0,
      status: "out_of_stock",
    },
  ],
}
