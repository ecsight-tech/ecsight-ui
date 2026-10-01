"use client"

import * as React from "react"
import type { ColumnFiltersState, OnChangeFn, PaginationState, SortingState, Updater } from "@tanstack/react-table"
import { debounce, parseAsIndex, parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { parseAsSort, type SortValue } from "@/lib/search-params"

type Options = {
  /** Column whose filter is the free-text search box → `?q=` */
  searchColumn?: string
  /** Columns with a single string filter (e.g. a status select) → `?<column>=` */
  filterColumns?: string[]
  defaultSort?: SortValue
  pageSize?: number
  /** Prefix every key when a page has more than one table, e.g. "orders_" */
  prefix?: string
}

const resolve = <T,>(updater: Updater<T>, old: T) =>
  typeof updater === "function" ? (updater as (old: T) => T)(old) : updater

/**
 * TanStack Table state (sorting, filters, pagination) kept in the URL with nuqs,
 * so refresh, back/forward and shared links all restore the same view.
 * Defaults are left out of the URL. Typing in search updates the URL after
 * 300 ms and replaces history; paging forward pushes history (Back = previous page).
 *
 * Needs `NuqsAdapter` (in components/providers.tsx) and, on prerendered
 * pages, a `<Suspense>` boundary above the table.
 */
export function useTableUrlState({
  searchColumn,
  filterColumns = [],
  defaultSort,
  pageSize = 10,
  prefix = "",
}: Options = {}) {
  const [state, setState] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      sort: defaultSort ? parseAsSort.withDefault(defaultSort) : parseAsSort,
      page: parseAsIndex.withDefault(0),
      size: parseAsInteger.withDefault(pageSize),
      ...Object.fromEntries(filterColumns.map((c) => [c, parseAsString])),
    },
    { urlKeys: Object.fromEntries(["q", "sort", "page", "size", ...filterColumns].map((k) => [k, prefix + k])) }
  )

  const sorting: SortingState = React.useMemo(() => (state.sort ? [state.sort] : []), [state.sort])
  const pagination: PaginationState = React.useMemo(
    () => ({ pageIndex: state.page, pageSize: state.size }),
    [state.page, state.size]
  )
  // Rebuilt only when a filter value changes — a new array on every page change would
  // make TanStack think the filters changed and jump back to page 1.
  const filterEntries: [string, string][] = []
  if (searchColumn && state.q) filterEntries.push([searchColumn, state.q])
  for (const c of filterColumns) {
    const v = (state as Record<string, unknown>)[c]
    if (typeof v === "string" && v) filterEntries.push([c, v])
  }
  const filterKey = JSON.stringify(filterEntries)
  const columnFilters: ColumnFiltersState = React.useMemo(
    () => (JSON.parse(filterKey) as [string, string][]).map(([id, value]) => ({ id, value })),
    [filterKey]
  )

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = resolve(updater, sorting)[0]
    setState({ sort: next ? { id: next.id, desc: next.desc } : null })
  }

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = resolve(updater, pagination)
    if (next.pageIndex === pagination.pageIndex && next.pageSize === pagination.pageSize) return
    // Paging forward pushes history so Back returns to the previous page. Going to
    // page 1 replaces it: that's also what TanStack does on its own when data changes.
    setState({ page: next.pageIndex, size: next.pageSize }, { history: next.pageIndex > 0 ? "push" : "replace" })
  }

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = resolve(updater, columnFilters)
    const value = (id: string) => {
      const v = next.find((f) => f.id === id)?.value
      return typeof v === "string" && v ? v : null
    }
    const q = searchColumn ? value(searchColumn) : null
    const typing = q !== (state.q || null)
    setState(
      {
        q,
        ...Object.fromEntries(filterColumns.map((c) => [c, value(c)])),
        page: null, // any filter change starts from page 1
      },
      typing ? { limitUrlUpdates: debounce(300) } : undefined
    )
  }

  return { sorting, onSortingChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange }
}
