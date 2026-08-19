import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconAlertTriangle,
  IconCurrencyDollar,
  IconDownload,
  IconPackage,
  IconPlus,
  IconX,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import { ProductDataTable } from "@/components/product-data-table"
import {
  type Product,
  type ProductCategory,
  type StockStatus,
  CATEGORY_OPTIONS,
  STOCK_STATUS_OPTIONS,
  computeProductStats,
  deriveStockStatus,
  initialProducts,
} from "@/lib/products-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"

export const Route = createFileRoute("/_auth/products")({
  component: ProductsPage,
})

// ─── Stat cards ───────────────────────────────────────────────────────────────

function ProductStatCards({ products }: { products: Product[] }) {
  const { totalProducts, lowStockCount, outOfStockCount, totalInventoryValue } =
    computeProductStats(products)

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n)

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalProducts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconPackage className="size-3.5" aria-hidden="true" />
              Catalog
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active product catalog
          </div>
          <div className="text-muted-foreground">
            {products.filter((p) => p.stockStatus === "in_stock").length} in
            stock
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {lowStockCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconAlertTriangle className="size-3.5" aria-hidden="true" />
              Warning
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Products running low
          </div>
          <div className="text-muted-foreground">
            10 units or fewer remaining
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Out of Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {outOfStockCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconX className="size-3.5" aria-hidden="true" />
              Critical
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Needs restocking
          </div>
          <div className="text-muted-foreground">Zero units available</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Inventory Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(totalInventoryValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="size-3.5" aria-hidden="true" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Stock value at cost
          </div>
          <div className="text-muted-foreground">Price × quantity on hand</div>
        </CardFooter>
      </Card>
    </div>
  )
}

// ─── Form state ───────────────────────────────────────────────────────────────

type ProductFormState = {
  name: string
  sku: string
  category: ProductCategory | ""
  price: string
  stock: string
  description: string
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  description: "",
}

function productToForm(p: Product): ProductFormState {
  return {
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: String(p.price),
    stock: String(p.stock),
    description: p.description ?? "",
  }
}

// ─── Add / Edit Sheet ─────────────────────────────────────────────────────────

interface ProductSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  form: ProductFormState
  onField: <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

function ProductSheet({
  open,
  onOpenChange,
  isEditing,
  form,
  onField,
  onSave,
}: ProductSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>{isEditing ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the product details below."
              : "Fill in the details to add a new product to the catalog."}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                placeholder="Wireless Headphones"
                value={form.name}
                onChange={(e) => onField("name", e.target.value)}
                required
              />
            </div>

            {/* SKU */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                placeholder="WH-BT500"
                value={form.sku}
                onChange={(e) => onField("sku", e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => onField("category", v as ProductCategory)}
              >
                <SelectTrigger id="product-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price + Stock row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-price">Price (USD)</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => onField("price", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-stock">Stock Qty</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => onField("stock", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                placeholder="Brief description of the product…"
                value={form.description}
                onChange={(e) => onField("description", e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>

            {/* Stock status preview */}
            {form.stock !== "" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Stock status:</span>
                {(() => {
                  const qty = parseInt(form.stock, 10)
                  const s: StockStatus = isNaN(qty)
                    ? "out_of_stock"
                    : deriveStockStatus(qty)
                  const opt = STOCK_STATUS_OPTIONS.find((o) => o.value === s)
                  return (
                    <span className="font-medium text-foreground">
                      {opt?.label}
                    </span>
                  )
                })()}
              </div>
            )}
          </div>

          <SheetFooter>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Product"}
            </Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null
  )
  const [form, setForm] = React.useState<ProductFormState>(EMPTY_FORM)

  function handleAdd() {
    setEditingProduct(null)
    setForm(EMPTY_FORM)
    setSheetOpen(true)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setForm(productToForm(product))
    setSheetOpen(true)
  }

  function handleDelete(product: Product) {
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  function handleField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(form.price) || 0
    const stock = parseInt(form.stock, 10) || 0
    const stockStatus = deriveStockStatus(stock)

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: form.name,
                sku: form.sku,
                category: form.category as ProductCategory,
                price,
                stock,
                stockStatus,
                description: form.description || undefined,
              }
            : p
        )
      )
    } else {
      const newProduct: Product = {
        id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
        name: form.name,
        sku: form.sku,
        category: form.category as ProductCategory,
        price,
        stock,
        stockStatus,
        description: form.description || undefined,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setProducts((prev) => [newProduct, ...prev])
    }

    setSheetOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Products"
            description="Manage your product catalog and inventory."
          >
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <IconDownload className="size-4" aria-hidden="true" />
                Export
              </Button>
              <Button size="sm" onClick={handleAdd}>
                <IconPlus className="size-4" aria-hidden="true" />
                Add Product
              </Button>
            </div>
          </PageHeader>

          <ProductStatCards products={products} />

          <ProductDataTable
            data={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <ProductSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isEditing={editingProduct !== null}
        form={form}
        onField={handleField}
        onSave={handleSave}
      />
    </div>
  )
}
