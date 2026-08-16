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
} from "@tabler/icons-react"
import { FlexRender } from "@tanstack/react-table"
import type { Table } from "@tanstack/react-table"

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = Table<any, any>

/** Optional label map so callers can override ugly column IDs (e.g. "totalSpend" → "Total Spend") */
type ColumnLabelMap = Record<string, string>

// ─── DataTableColumnVisibility ────────────────────────────────────────────────

export interface DataTableColumnVisibilityProps {
    table: AnyTable
    /** Override display labels for column ids. Falls back to `col.id`. */
    columnLabels?: ColumnLabelMap
}

export function DataTableColumnVisibility({
    table,
    columnLabels = {},
}: DataTableColumnVisibilityProps) {
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

// ─── DataTable (full shell) ───────────────────────────────────────────────────

export interface DataTableProps {
    table: AnyTable
    /**
     * The rows to render in the table body. Pass your already-paginated,
     * already-filtered rows here so the shell stays generic.
     */
    rows: ReturnType<AnyTable["getRowModel"]>["rows"]
    /** Number of columns — used for the empty-state colspan. */
    columnCount: number
    /** Toolbar content rendered above the table (search, faceted filters, etc.) */
    toolbar?: React.ReactNode
    /** Rendered inside each TableRow — defaults to standard FlexRender cells. */
    renderRow?: (
        row: ReturnType<AnyTable["getRowModel"]>["rows"][number]
    ) => React.ReactNode
    /** Text shown when `rows` is empty. */
    emptyMessage?: string
    /** Pagination props. When omitted the pagination bar is not rendered. */
    pagination?: DataTablePaginationProps
    /** Column label overrides forwarded to DataTableColumnVisibility. */
    columnLabels?: ColumnLabelMap
    /** When true the column-visibility dropdown is shown in the toolbar's right side. Default: true */
    showColumnVisibility?: boolean
}

export function DataTable({
    table,
    rows,
    columnCount,
    toolbar,
    renderRow,
    emptyMessage = "No results.",
    pagination,
    columnLabels,
    showColumnVisibility = true,
}: DataTableProps) {
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
                    <TableBody>
                        {rows.length ? (
                            rows.map((row) =>
                                renderRow ? (
                                    renderRow(row)
                                ) : (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
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
