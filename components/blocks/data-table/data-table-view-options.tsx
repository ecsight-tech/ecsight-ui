"use client"

import type { RowData, Table } from "@tanstack/react-table"
import { Tuning2Icon } from "@solar-icons/react/linear"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Human label for menus (column visibility); headers can be custom components */
    label?: string
  }
}

/**
 * Show/hide columns. Lists every column that can hide (`enableHiding` isn't
 * false) using `meta.label`. Persist the state yourself — e.g. `useLocalStorage`
 * for `columnVisibility` — so each viewer keeps their layout.
 */
export function DataTableViewOptions<TData>({ table }: { table: Table<TData> }) {
  const columns = table.getAllColumns().filter((c) => c.getCanHide() && c.columnDef.meta?.label)
  const hidden = columns.filter((c) => !c.getIsVisible()).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Tuning2Icon />
          คอลัมน์
          {hidden > 0 && <span className="text-muted-foreground tabular-nums">· ซ่อน {hidden}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>แสดงคอลัมน์</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((c) => (
          <DropdownMenuCheckboxItem
            key={c.id}
            checked={c.getIsVisible()}
            onCheckedChange={(v) => c.toggleVisibility(!!v)}
            // keep the menu open while toggling several columns
            onSelect={(e) => e.preventDefault()}
          >
            {c.columnDef.meta?.label}
          </DropdownMenuCheckboxItem>
        ))}
        {hidden > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => table.resetColumnVisibility(true)}>
              แสดงทั้งหมด
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
