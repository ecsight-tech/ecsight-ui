"use client"

import * as React from "react"
import type { Column, Row } from "@tanstack/react-table"
import { AddCircleIcon, CheckIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export type FacetOption = { value: string; label: string; icon?: React.ReactNode }

/** filterFn for faceted columns: no selection = everything, else the row's value must be selected */
export function facetFilterFn<TData>(row: Row<TData>, id: string, value: string[] | undefined) {
  return !value?.length || value.includes(String(row.getValue(id)))
}

/**
 * Multi-select filter for one column, with live counts. Counts come from
 * TanStack's faceted row model, so they reflect every *other* active filter.
 * The table needs `getFacetedRowModel()` + `getFacetedUniqueValues()` and
 * the column `filterFn: facetFilterFn`.
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: {
  column?: Column<TData, TValue>
  title: string
  options: FacetOption[]
}) {
  const counts = column?.getFacetedUniqueValues()
  const selected = new Set((column?.getFilterValue() as string[] | undefined) ?? [])

  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column?.setFilterValue(next.size ? [...next] : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <AddCircleIcon className="text-muted-foreground" />
          {title}
          {selected.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              {selected.size > 2 ? (
                <Badge variant="secondary" className="rounded-sm px-1.5 font-normal tabular-nums">
                  {selected.size} รายการ
                </Badge>
              ) : (
                options
                  .filter((o) => selected.has(o.value))
                  .map((o) => (
                    <Badge key={o.value} variant="secondary" className="rounded-sm px-1.5 font-normal">
                      {o.label}
                    </Badge>
                  ))
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          {options.length > 6 && <CommandInput placeholder={`ค้นหา${title}…`} />}
          <CommandList>
            <CommandEmpty>ไม่พบตัวเลือก</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const isSelected = selected.has(o.value)
                return (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    aria-checked={isSelected}
                    onSelect={() => toggle(o.value)}
                  >
                    {/* checkbox look (not data-checked: CommandItem would add its own trailing check) */}
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-4 place-items-center rounded-[4px] border border-input transition-colors",
                        isSelected && "border-primary bg-primary text-primary-foreground"
                      )}
                    >
                      {isSelected && <CheckIcon className="size-3" />}
                    </span>
                    {o.icon}
                    <span className="flex-1 truncate">{o.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{counts?.get(o.value) ?? 0}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => column?.setFilterValue(undefined)} className="justify-center">
                    ล้างตัวกรอง
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
