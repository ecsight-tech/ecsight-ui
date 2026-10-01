"use client"

import * as React from "react"
import { AltArrowDownIcon, CheckIcon, CloseCircleIcon } from "@solar-icons/react/linear"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "cn"

import { spring } from "@/lib/motion"
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

export type MultiSelectOption = { value: string; label: string; group?: string }

/**
 * Pick several values from a list (tags, assignees, branches). Selected
 * values show as chips in the trigger (up to `maxChips`, then "+n"); the
 * popover has search, optional groups, "เลือกทั้งหมด" and "ล้าง". The list
 * stays open while picking. For ≤ 5 always-visible options use checkboxes.
 */
function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "เลือก…",
  searchPlaceholder = "ค้นหา…",
  maxChips = 2,
  id,
  disabled,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
}: {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  maxChips?: number
  id?: string
  disabled?: boolean
  className?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}) {
  const [open, setOpen] = React.useState(false)
  const selected = new Set(value)
  const chosen = options.filter((o) => selected.has(o.value))
  const groups = [...new Set(options.map((o) => o.group ?? ""))]

  const toggle = (v: string) => onChange(selected.has(v) ? value.filter((x) => x !== v) : [...value, v])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div data-slot="multi-select" className={cn("relative inline-flex w-full", className)}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={ariaInvalid}
            aria-describedby={describedBy}
            disabled={disabled}
            className={cn(
              "w-full justify-start gap-1.5 overflow-hidden px-2 font-normal",
              chosen.length > 0 && "pr-14",
              "aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/50"
            )}
          >
            {chosen.length === 0 && <span className="px-0.5 text-muted-foreground">{placeholder}</span>}
            <AnimatePresence initial={false} mode="popLayout">
              {chosen.slice(0, maxChips).map((o) => (
                <motion.span
                  key={o.value}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: spring.snappy }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                >
                  <Badge variant="secondary" className="max-w-32 truncate rounded-sm px-1.5 font-normal">
                    {o.label}
                  </Badge>
                </motion.span>
              ))}
            </AnimatePresence>
            {chosen.length > maxChips && (
              <span className="text-xs text-muted-foreground tabular-nums">+{chosen.length - maxChips}</span>
            )}
            <AltArrowDownIcon className="absolute right-2.5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        {chosen.length > 0 && !disabled && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="ล้างที่เลือก"
            className="absolute top-1/2 right-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onChange([])}
          >
            <CloseCircleIcon />
          </Button>
        )}
      </div>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0" align="start">
        <Command>
          {options.length > 7 && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>ไม่พบตัวเลือก</CommandEmpty>
            {groups.map((g) => (
              <CommandGroup key={g || "_"} heading={g || undefined}>
                {options
                  .filter((o) => (o.group ?? "") === g)
                  .map((o) => {
                    const isSelected = selected.has(o.value)
                    return (
                      <CommandItem key={o.value} value={`${o.label} ${o.value}`} aria-checked={isSelected} onSelect={() => toggle(o.value)}>
                        <span
                          aria-hidden
                          className={cn(
                            "grid size-4 place-items-center rounded-[4px] border border-input transition-colors",
                            isSelected && "border-primary bg-primary text-primary-foreground"
                          )}
                        >
                          {isSelected && <CheckIcon className="size-3" />}
                        </span>
                        <span className="truncate">{o.label}</span>
                      </CommandItem>
                    )
                  })}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup>
              <div className="flex gap-1 p-1">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => onChange(options.map((o) => o.value))}>
                  เลือกทั้งหมด
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" disabled={!value.length} onClick={() => onChange([])}>
                  ล้าง
                </Button>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
