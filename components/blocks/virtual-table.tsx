"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { parseISO } from "date-fns"
import { SortVerticalIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { formatDate, formatTHB } from "@/lib/format"
import { statusLabel, type Order } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const ROW_HEIGHT = 40
const nf = new Intl.NumberFormat("th-TH")

const sortable = (label: string, align?: "right") =>
  function SortableHeader({ column }: { column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" } }) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={cn("-mx-2 text-muted-foreground", align === "right" && "ml-auto flex")}
      >
        {label}
        <SortVerticalIcon className="size-3.5" />
      </Button>
    )
  }

const columns: ColumnDef<Order>[] = [
  { accessorKey: "id", header: "เลขที่", size: 130, cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
  { accessorKey: "customer", header: sortable("ลูกค้า"), size: 220 },
  { accessorKey: "status", header: "สถานะ", size: 120, cell: ({ row }) => statusLabel[row.original.status] },
  { accessorKey: "channel", header: "ช่องทาง", size: 110 },
  {
    accessorKey: "date",
    header: sortable("วันที่"),
    size: 120,
    cell: ({ row }) => formatDate(parseISO(row.original.date), { style: "short" }),
  },
  {
    accessorKey: "amount",
    header: sortable("ยอดเงิน", "right"),
    size: 120,
    cell: ({ row }) => <div className="text-right tabular-nums">{formatTHB(row.original.amount)}</div>,
  },
]

/**
 * Block: virtualized table for thousands of rows — only the rows in view are
 * in the DOM (≈ 20 instead of 10,000). Sticky header, fixed 40px rows,
 * sorting, no pagination and **no row animations** (they fight the
 * virtualizer). Use it when people scan/scroll a long list; for filtering and
 * bulk actions on a page of results, use the Data Table block.
 */
export function VirtualTable({ data, height = 480 }: { data: Order[]; height?: number }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })
  const items = virtualizer.getVirtualItems()
  // Spacer rows keep real <table> layout (column widths, borders) while skipping off-screen rows
  const padTop = items[0]?.start ?? 0
  const padBottom = virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0)

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex items-center justify-between border-b p-3 text-sm text-muted-foreground">
        <span className="tabular-nums">{nf.format(rows.length)} รายการ</span>
        <span className="hidden sm:inline">เลื่อนเพื่อดูเพิ่ม — แสดงผลเฉพาะแถวที่อยู่บนจอ</span>
      </div>
      {/* the scroll container must be the table's direct scroller, or the sticky header breaks */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="ตารางคำสั่งซื้อทั้งหมด"
        tabIndex={0}
        className="relative overflow-auto outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        style={{ height }}
      >
        <table data-slot="table" className="w-full min-w-[820px] table-fixed text-sm" aria-rowcount={rows.length + 1}>
          <thead className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} aria-rowindex={1}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    style={{ width: h.getSize() }}
                    className="h-10 bg-muted/40 px-3 text-left align-middle font-medium whitespace-nowrap text-muted-foreground"
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {padTop > 0 && (
              <tr aria-hidden>
                <td colSpan={columns.length} style={{ height: padTop }} />
              </tr>
            )}
            {items.map((v) => {
              const row = rows[v.index]
              return (
                <tr
                  key={row.id}
                  aria-rowindex={v.index + 2}
                  style={{ height: ROW_HEIGHT }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="truncate px-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
            {padBottom > 0 && (
              <tr aria-hidden>
                <td colSpan={columns.length} style={{ height: padBottom }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
