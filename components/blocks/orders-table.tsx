"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table"
import { parseISO } from "date-fns"
import { AnimatePresence, motion } from "motion/react"
import {
  CloseCircleIcon,
  DeliveryIcon,
  DownloadMinimalisticIcon,
  MagnifierIcon,
  MenuDotsIcon,
  SortVerticalIcon,
} from "@solar-icons/react/linear"
import { InboxIcon } from "@solar-icons/react/bold-duotone"
import { toast } from "sonner"
import { cn } from "cn"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { formatDate, formatTHB } from "@/lib/format"
import { spring } from "@/lib/motion"
import { statusLabel, type Order, type OrderStatus } from "@/lib/demo-data"
import { DataTableBulkBar } from "@/components/blocks/data-table/data-table-bulk-bar"
import {
  DataTableFacetedFilter,
  facetFilterFn,
  type FacetOption,
} from "@/components/blocks/data-table/data-table-faceted-filter"
import { DataTablePagination } from "@/components/blocks/data-table/data-table-pagination"
import { DataTableViewOptions } from "@/components/blocks/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/ui/empty-state"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const MotionRow = motion.create(TableRow)

const statusTone: Record<OrderStatus, StatusTone> = {
  paid: "success",
  pending: "warning",
  shipped: "info",
  refunded: "neutral",
}

const statusOptions: FacetOption[] = (Object.keys(statusLabel) as OrderStatus[]).map((s) => ({
  value: s,
  label: statusLabel[s],
}))
const channelOptions: FacetOption[] = ["Web", "LINE OA", "Shopee", "Lazada"].map((c) => ({ value: c, label: c }))

function SortHeader({ label, onClick, align }: { label: string; onClick: () => void; align?: "right" }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("-mx-2 text-muted-foreground", align === "right" && "ml-auto flex")}
    >
      {label}
      <SortVerticalIcon className="size-3.5" />
    </Button>
  )
}

const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="เลือกทั้งหมด"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label={`เลือก ${row.original.id}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "เลขที่",
    meta: { label: "เลขที่" },
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <SortHeader label="ลูกค้า" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    enableHiding: false,
    cell: ({ row }) => (
      <div className="grid">
        <span className="font-medium">{row.original.customer}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
    filterFn: (row, _id, value: string) => {
      const q = value.toLowerCase()
      return [row.original.customer, row.original.email, row.original.id].some((s) => s.toLowerCase().includes(q))
    },
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    meta: { label: "สถานะ" },
    cell: ({ row }) => (
      <StatusBadge tone={statusTone[row.original.status]}>{statusLabel[row.original.status]}</StatusBadge>
    ),
    filterFn: facetFilterFn,
  },
  { accessorKey: "channel", header: "ช่องทาง", meta: { label: "ช่องทาง" }, filterFn: facetFilterFn },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortHeader label="วันที่" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    meta: { label: "วันที่" },
    cell: ({ row }) => formatDate(parseISO(row.original.date), { style: "short" }),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortHeader label="ยอดเงิน" align="right" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    meta: { label: "ยอดเงิน" },
    cell: ({ row }) => <div className="text-right font-medium tabular-nums">{formatTHB(row.original.amount)}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`การทำงานสำหรับ ${row.original.id}`}>
            <MenuDotsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => navigator.clipboard?.writeText(row.original.id)}>คัดลอกเลขที่</DropdownMenuItem>
          <DropdownMenuItem>ดูรายละเอียด</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">ยกเลิกคำสั่งซื้อ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

/**
 * Block: data table — search, faceted status/channel filters with counts,
 * sortable columns, show/hide columns (remembered per viewer), row selection
 * with a floating bulk-action bar, and pagination with rows-per-page.
 * Rows fade/slide in on filter and page changes.
 * View state lives in the URL (hooks/use-table-url-state.ts), so render it
 * inside <Suspense> on prerendered pages.
 */
export function OrdersTable({ data }: { data: Order[] }) {
  // Search, filters, sort and page live in the URL (?q=&status=paid,shipped&sort=&page=); selection stays local.
  const { sorting, onSortingChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange } =
    useTableUrlState({
      searchColumn: "customer",
      facetColumns: ["status", "channel"],
      defaultSort: { id: "date", desc: true },
      pageSize: 8,
    })
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>("ecsight:orders-table:columns", {})

  // TanStack Table returns non-memoizable functions; the React Compiler lint knows this.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination, rowSelection, columnVisibility },
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const search = (table.getColumn("customer")?.getFilterValue() as string) ?? ""
  const filtered = columnFilters.length > 0
  const rows = table.getRowModel().rows
  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <InputGroup className="w-full sm:w-64">
          <InputGroupAddon>
            <MagnifierIcon />
          </InputGroupAddon>
          <InputGroupInput
            data-shortcut="search"
            placeholder="ค้นหาลูกค้า อีเมล หรือเลขที่…"
            aria-label="ค้นหาคำสั่งซื้อ"
            aria-keyshortcuts="/"
            value={search}
            onChange={(e) => table.getColumn("customer")?.setFilterValue(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && e.currentTarget.blur()}
          />
          {/* hint for the / shortcut; hidden once you're typing */}
          {!search && (
            <InputGroupAddon align="inline-end" className="group-has-[input:focus]/input-group:hidden">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          )}
        </InputGroup>
        <DataTableFacetedFilter column={table.getColumn("status")} title="สถานะ" options={statusOptions} />
        <DataTableFacetedFilter column={table.getColumn("channel")} title="ช่องทาง" options={channelOptions} />
        <AnimatePresence>
          {filtered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: spring.snappy }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button variant="ghost" onClick={() => table.resetColumnFilters()}>
                ล้างตัวกรอง
                <CloseCircleIcon />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="ml-auto flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button
            variant="outline"
            onClick={() =>
              toast.success("กำลังส่งออกไฟล์ CSV", {
                description: `${table.getFilteredRowModel().rows.length} รายการ`,
              })
            }
          >
            <DownloadMinimalisticIcon />
            ส่งออก
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h) => (
                <TableHead key={h.id} className={cn(h.id === "select" && "w-10 pl-4", h.id === "actions" && "w-12")}>
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((row) => (
              <MotionRow
                key={row.id}
                layout="position"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={spring.snappy}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn(cell.column.id === "select" && "pl-4")}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </MotionRow>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>

      {rows.length === 0 && (
        <EmptyState
          icon={InboxIcon}
          title="ไม่พบคำสั่งซื้อ"
          description="ลองเปลี่ยนคำค้นหาหรือตัวกรอง"
          action={
            <Button variant="outline" onClick={() => table.resetColumnFilters()}>
              ล้างตัวกรอง
            </Button>
          }
        />
      )}

      <DataTablePagination table={table} />

      <DataTableBulkBar table={table}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.success("กำลังส่งออกไฟล์ CSV", { description: `${selectedRows.length} รายการที่เลือก` })}
        >
          <DownloadMinimalisticIcon />
          ส่งออก
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            toast.success(`ทำเครื่องหมายจัดส่งแล้ว ${selectedRows.length} รายการ`)
            table.resetRowSelection()
          }}
        >
          <DeliveryIcon />
          จัดส่งแล้ว
        </Button>
      </DataTableBulkBar>
    </Card>
  )
}
