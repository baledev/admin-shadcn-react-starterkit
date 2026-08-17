/**
 * data-table-base.tsx
 *
 * Reusable primitives shared by every data-table in this app.
 * Each piece accepts a TanStack Table v9 `table` instance that is
 * created by the caller — keeping column definitions, filterFns, and
 * domain state out of this file.
 *
 * Exports:
 *   DataTableColumnVisibility  – "Columns" dropdown (hide/show columns)
 *   DataTableFacetedFilter     – multi-select faceted filter (status/plan, etc.)
 *   DataTablePagination        – rows-per-page select + page nav buttons
 *   DataTable                  – full shell: toolbar slot + table + pagination
 */
import * as React from "react"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconLayoutColumns,
    IconPlus,
} from "@tabler/icons-react"
import { FlexRender } from "@tanstack/react-table"
import type {
    Row,
    RowData,
    Table,
    TableFeatures,
} from "@tanstack/react-table"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Label } from "@workspace/ui/components/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Separator } from "@workspace/ui/components/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import {
    Table as TableRoot,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Broad table/row/column/header types used internally for rendering.
 * The `any` feature generic makes TanStack resolve every feature API, so all
 * methods used below (getVisibleCells, getIsSelected, getCanHide, ...) exist.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = Table<any, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Row<any, any>

/** Optional label map so callers can override ugly column IDs (e.g. "totalSpend" → "Total Spend") */
type ColumnLabelMap = Record<string, string>

// ─── DataTableColumnVisibility ────────────────────────────────────────────────

export interface DataTableColumnVisibilityProps<
    TFeatures extends TableFeatures,
    TData extends RowData,
> {
    table: Table<TFeatures, TData>
    /** Override display labels for column ids. Falls back to `col.id`. */
    columnLabels?: ColumnLabelMap
}

export function DataTableColumnVisibility<
    TFeatures extends TableFeatures,
    TData extends RowData,
>({
    table: tableProp,
    columnLabels = {},
}: DataTableColumnVisibilityProps<TFeatures, TData>) {
    const table = tableProp as AnyTable
    const hidableColumns = table
        .getAllColumns()
        .filter(
            (col) => typeof col.accessorFn !== "undefined" && col.getCanHide()
        )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" className="h-8" />}
            >
                <IconLayoutColumns className="size-4" />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                    {hidableColumns.map((col) => (
                        <DropdownMenuCheckboxItem
                            key={col.id}
                            className="capitalize"
                            checked={col.getIsVisible()}
                            onCheckedChange={(value) =>
                                col.toggleVisibility(!!value)
                            }
                        >
                            {columnLabels[col.id] ?? col.id}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// ─── DataTablePagination ──────────────────────────────────────────────────────

export interface DataTablePaginationProps {
    /** Current page index (0-based) */
    pageIndex: number
    /** Total number of pages */
    pageCount: number
    /** Current page size */
    pageSize: number
    /** Number of selected rows shown in the left info text */
    selectedCount: number
    /** Total filtered rows shown in the left info text */
    totalCount: number
    onPageChange: (index: number) => void
    onPageSizeChange: (size: number) => void
    pageSizeOptions?: number[]
}

export function DataTablePagination({
    pageIndex,
    pageCount,
    pageSize,
    selectedCount,
    totalCount,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50],
}: DataTablePaginationProps) {
    return (
        <div className="flex items-center justify-between px-1">
            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                {selectedCount} of {totalCount} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                        Rows per page
                    </Label>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((ps) => (
                                <SelectItem key={ps} value={`${ps}`}>
                                    {ps}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {pageIndex + 1} of {pageCount}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(0)}
                        disabled={pageIndex === 0}
                    >
                        <span className="sr-only">Go to first page</span>
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => onPageChange(pageIndex - 1)}
                        disabled={pageIndex === 0}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => onPageChange(pageIndex + 1)}
                        disabled={pageIndex >= pageCount - 1}
                    >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => onPageChange(pageCount - 1)}
                        disabled={pageIndex >= pageCount - 1}
                    >
                        <span className="sr-only">Go to last page</span>
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ─── DataTableFacetedFilter ───────────────────────────────────────────────────

export interface FacetedFilterOption {
    label: string
    value: string
}

export interface DataTableFacetedFilterProps {
    /** Label shown on the trigger button and as the popover header. */
    label: string
    /** Selectable options. */
    options: FacetedFilterOption[]
    /** Currently selected values (column filter state). */
    selected: string[]
    /** Called with the new selection whenever it changes. */
    onSelectionChange: (values: string[]) => void
}

export function DataTableFacetedFilter({
    label,
    options,
    selected,
    onSelectionChange,
}: DataTableFacetedFilterProps) {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onSelectionChange(selected.filter((v) => v !== value))
        } else {
            onSelectionChange([...selected, value])
        }
    }

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed" />
                }
            >
                <IconPlus className="size-3.5" />
                {label}
                {selected.length > 0 && (
                    <>
                        <Separator orientation="vertical" className="mx-0.5 h-4" />
                        <span className="flex items-center gap-1">
                            {selected.length > 1 ? (
                                <Badge variant="secondary" className="rounded-sm px-1 text-xs font-normal">
                                    {selected.length} selected
                                </Badge>
                            ) : (
                                options
                                    .filter((o) => selected.includes(o.value))
                                    .map((o) => (
                                        <Badge
                                            key={o.value}
                                            variant="secondary"
                                            className="rounded-sm px-1 text-xs font-normal"
                                        >
                                            {o.label}
                                        </Badge>
                                    ))
                            )}
                        </span>
                    </>
                )}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-0">
                <div className="border-b px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </div>
                <div className="p-1">
                    {options.map((option) => {
                        const checked = selected.includes(option.value)
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => toggle(option.value)}
                                className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm capitalize transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                            >
                                <div
                                    className={`flex size-4 shrink-0 items-center justify-center rounded-sm border ${
                                        checked
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-input"
                                    }`}
                                >
                                    {checked && (
                                        <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                {option.label}
                            </button>
                        )
                    })}
                </div>
                {selected.length > 0 && (
                    <div className="border-t p-1">
                        <button
                            type="button"
                            onClick={() => onSelectionChange([])}
                            className="flex w-full cursor-default items-center justify-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

// ─── DataTable (full shell) ───────────────────────────────────────────────────

export interface DataTableProps<
    TFeatures extends TableFeatures,
    TData extends RowData,
> {
    table: Table<TFeatures, TData>
    /**
     * The rows to render in the table body. Pass your already-paginated,
     * already-filtered rows here so the shell stays generic.
     */
    rows: Row<TFeatures, TData>[]
    /** Number of columns — used for the empty-state colspan. */
    columnCount: number
    /** Toolbar content rendered above the table (search, faceted filters, etc.) */
    toolbar?: React.ReactNode
    /** Rendered inside each TableRow — defaults to standard FlexRender cells. */
    renderRow?: (row: Row<TFeatures, TData>) => React.ReactNode
    /** Text shown when `rows` is empty. */
    emptyMessage?: string
    /** Pagination props. When omitted the pagination bar is not rendered. */
    pagination?: DataTablePaginationProps
    /** Column label overrides forwarded to DataTableColumnVisibility. */
    columnLabels?: ColumnLabelMap
    /** When true the column-visibility dropdown is shown in the toolbar's right side. Default: true */
    showColumnVisibility?: boolean
    /** Extra classes for the table body (e.g. per-column sizing for drag handles). */
    tableBodyClassName?: string
}

export function DataTable<
    TFeatures extends TableFeatures,
    TData extends RowData,
>({
    table: tableProp,
    rows,
    columnCount,
    toolbar,
    renderRow,
    emptyMessage = "No results.",
    pagination,
    columnLabels,
    showColumnVisibility = true,
    tableBodyClassName,
}: DataTableProps<TFeatures, TData>) {
    const table = tableProp as AnyTable
    return (
        <div className="flex flex-col gap-4">
            {/* ── Toolbar ── */}
            {(toolbar || showColumnVisibility) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
                    {showColumnVisibility && (
                        <div className="flex items-center gap-2">
                            <DataTableColumnVisibility
                                table={table}
                                columnLabels={columnLabels}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* ── Table ── */}
            <div className="overflow-hidden rounded-lg border">
                <TableRoot>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className={tableBodyClassName}>
                        {rows.length ? (
                            rows.map((row) =>
                                renderRow ? (
                                    <React.Fragment key={row.id}>
                                        {renderRow(row)}
                                    </React.Fragment>
                                ) : (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            (row as AnyRow).getIsSelected() && "selected"
                                        }
                                    >
                                        {(row as AnyRow)
                                            .getVisibleCells()
                                            .map((cell) => (
                                                <TableCell key={cell.id}>
                                                    <FlexRender cell={cell} />
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                )
                            )
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnCount}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </TableRoot>
            </div>

            {/* ── Pagination ── */}
            {pagination && <DataTablePagination {...pagination} />}
        </div>
    )
}
