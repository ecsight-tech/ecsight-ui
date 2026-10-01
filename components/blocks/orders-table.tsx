"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { parseISO } from "date-fns"
import { AnimatePresence, motion } from "motion/react"
import {
  AltArrowLeftIcon,
  AltArrowRightIcon,
  DownloadMinimalisticIcon,
  MagnifierIcon,
  MenuDotsIcon,
  SortVerticalIcon,
} from "@solar-icons/react/linear"
import { InboxIcon } from "@solar-icons/react/bold-duotone"
import { toast } from "sonner"
import { cn } from "cn"

import { useTableUrlState } from "@/hooks/use-table-url-state"
import { formatDate, formatTHB } from "@/lib/format"
import { spring } from "@/lib/motion"
import { statusLabel, type Order, type OrderStatus } from "@/lib/demo-data"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const MotionRow = motion.create(TableRow)

const statusTone: Record<OrderStatus, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/15 text-foreground",
  shipped: "bg-primary/10 text-primary",
  refunded: "bg-muted text-muted-foreground",
}

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
  },
  {
    accessorKey: "id",
    header: "เลขที่",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <SortHeader label="ลูกค้า" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
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
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("border-transparent", statusTone[row.original.status])}>
        {statusLabel[row.original.status]}
      </Badge>
    ),
    filterFn: (row, id, value: string) => value === "all" || row.getValue(id) === value,
  },
  { accessorKey: "channel", header: "ช่องทาง" },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortHeader label="วันที่" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => formatDate(parseISO(row.original.date), { style: "short" }),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortHeader label="ยอดเงิน" align="right" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => <div className="text-right font-medium tabular-nums">{formatTHB(row.original.amount)}</div>,
  },
  {
    id: "actions",
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
 * Block: data table with search, status filter, sortable columns, row
 * selection, pagination and an animated empty state. Rows fade/slide in on
 * filter and page changes (layout animation keeps the remaining rows smooth).
 * View state lives in the URL (hooks/use-table-url-state.ts), so render it
 * inside <Suspense> on prerendered pages.
 */
export function OrdersTable({ data }: { data: Order[] }) {
  // Search, status, sort and page live in the URL (?q=&status=&sort=&page=); selection stays local.
  const { sorting, onSortingChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange } =
    useTableUrlState({
      searchColumn: "customer",
      filterColumns: ["status"],
      defaultSort: { id: "date", desc: true },
      pageSize: 8,
    })
  const [rowSelection, setRowSelection] = React.useState({})

  // TanStack Table returns non-memoizable functions; the React Compiler lint knows this.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination, rowSelection },
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const search = (table.getColumn("customer")?.getFilterValue() as string) ?? ""
  const status = (table.getColumn("status")?.getFilterValue() as string) ?? "all"
  const selected = table.getFilteredSelectedRowModel().rows.length
  const rows = table.getRowModel().rows

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <MagnifierIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="ค้นหาลูกค้า อีเมล หรือเลขที่…"
            aria-label="ค้นหาคำสั่งซื้อ"
            value={search}
            onChange={(e) => table.getColumn("customer")?.setFilterValue(e.target.value)}
          />
        </InputGroup>
        <Select value={status} onValueChange={(v) => table.getColumn("status")?.setFilterValue(v)}>
          <SelectTrigger className="w-36" aria-label="กรองตามสถานะ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            {(Object.keys(statusLabel) as OrderStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <AnimatePresence>
            {selected > 0 && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0, transition: spring.snappy }}
                exit={{ opacity: 0, x: 8 }}
                className="text-sm text-muted-foreground tabular-nums"
              >
                เลือก {selected} รายการ
              </motion.span>
            )}
          </AnimatePresence>
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
          description="ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ"
          action={
            <Button variant="outline" onClick={() => table.resetColumnFilters()}>
              ล้างตัวกรอง
            </Button>
          }
        />
      )}

      <div className="flex items-center justify-between gap-2 border-t p-3 text-sm text-muted-foreground">
        <span className="tabular-nums">
          {table.getFilteredRowModel().rows.length} รายการ · หน้า {table.getState().pagination.pageIndex + 1}/
          {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="หน้าก่อนหน้า"
          >
            <AltArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="หน้าถัดไป"
          >
            <AltArrowRightIcon />
          </Button>
        </div>
      </div>
    </Card>
  )
}
