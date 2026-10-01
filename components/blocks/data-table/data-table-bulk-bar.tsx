"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { AnimatePresence, motion } from "motion/react"
import { CloseIcon } from "@solar-icons/react/linear"

import { duration, ease, spring } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

/**
 * Floating action bar that rises from the bottom of the viewport while rows
 * are selected: "เลือก 3 รายการ", your actions, and ✕ to clear. Esc clears
 * too (unless focus is in a field or an overlay is open).
 * Actions are `size="sm"` Buttons; keep it to ≤ 3, put the rest in a menu.
 */
export function DataTableBulkBar<TData>({
  table,
  children,
}: {
  table: Table<TData>
  children: React.ReactNode
}) {
  const count = table.getFilteredSelectedRowModel().rows.length

  React.useEffect(() => {
    if (!count) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      const t = e.target as HTMLElement | null
      if (t?.closest("input, textarea, select, [role=dialog], [role=menu], [role=listbox]")) return
      table.resetRowSelection()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [count, table])

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          role="toolbar"
          aria-label="การทำงานกับรายการที่เลือก"
          initial={{ opacity: 0, y: 24, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%", transition: spring.snappy }}
          exit={{ opacity: 0, y: 16, x: "-50%", transition: { duration: duration.fast, ease: ease.in } }}
          className="fixed bottom-6 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-xl border bg-popover p-1.5 pl-3 text-sm text-popover-foreground shadow-lg"
        >
          <span className="font-medium whitespace-nowrap tabular-nums" aria-live="polite">
            เลือก {count} รายการ
          </span>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">{children}</div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="ล้างการเลือก (Esc)"
            onClick={() => table.resetRowSelection()}
          >
            <CloseIcon />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
