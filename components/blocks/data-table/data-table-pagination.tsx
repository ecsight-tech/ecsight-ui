"use client"

import type { Table } from "@tanstack/react-table"
import {
  AltArrowLeftIcon,
  AltArrowRightIcon,
  DoubleAltArrowLeftIcon,
  DoubleAltArrowRightIcon,
} from "@solar-icons/react/linear"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const nf = new Intl.NumberFormat("th-TH")

/**
 * Footer: "แสดง 9–16 จาก 60 รายการ" (or the selection count), rows-per-page
 * select and first/prev/next/last. First/last hide on small screens.
 */
export function DataTablePagination<TData>({
  table,
  pageSizes = [8, 20, 50],
}: {
  table: Table<TData>
  pageSizes?: number[]
}) {
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)
  const pages = Math.max(table.getPageCount(), 1)
  const selected = table.getFilteredSelectedRowModel().rows.length
  const sizes = pageSizes.includes(pageSize) ? pageSizes : [...pageSizes, pageSize].sort((a, b) => a - b)

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t p-3 text-sm text-muted-foreground">
      <span className="tabular-nums" aria-live="polite">
        {selected > 0
          ? `เลือก ${nf.format(selected)} จาก ${nf.format(total)} รายการ`
          : `แสดง ${nf.format(from)}–${nf.format(to)} จาก ${nf.format(total)} รายการ`}
      </span>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span>แถวต่อหน้า</span>
          <Select value={String(pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
            <SelectTrigger size="sm" className="w-18 tabular-nums" aria-label="แถวต่อหน้า">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {sizes.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="tabular-nums">
          หน้า {nf.format(pageIndex + 1)}/{nf.format(pages)}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden sm:inline-flex"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="หน้าแรก"
          >
            <DoubleAltArrowLeftIcon />
          </Button>
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
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden sm:inline-flex"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="หน้าสุดท้าย"
          >
            <DoubleAltArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
