"use client"

import * as React from "react"
import { dateMatchModifiers, type DateRange, type Matcher } from "@daypicker/react"
import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"
import { CalendarIcon, CloseCircleIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { formatDate, formatDateRange, parseThaiDate } from "@/lib/format"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Era = "be" | "ce"

type TriggerProps = {
  id?: string
  className?: string
  era?: Era
  disabled?: boolean
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

/** Calendar options every picker passes through */
type CalendarOptions = {
  /** Days that can't be picked, e.g. `{ after: new Date() }` (any DayPicker matcher) */
  disabledDays?: Matcher | Matcher[]
  /** `"dropdown"` adds month/year selects — use for dates far away (birthdays, contracts) */
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  /** First/last month reachable (also bounds the year dropdown) */
  startMonth?: Date
  endMonth?: Date
}

/* ─── DatePicker (button) ──────────────────────────────────────────────── */

/**
 * One date from a button + popover — best for filters and short pickers.
 * For form fields people fill in all day, prefer `DateInput` (typeable).
 */
function DatePicker({
  value,
  onChange,
  placeholder = "เลือกวันที่",
  era = "be",
  clearable = true,
  disabledDays,
  captionLayout,
  startMonth,
  endMonth,
  className,
  ...trigger
}: TriggerProps &
  CalendarOptions & {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    /** Show a × to clear the value (default true) */
    clearable?: boolean
  }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TriggerFrame
        className={className}
        onClear={clearable && value && !trigger.disabled ? () => onChange?.(undefined) : undefined}
      >
        <PopoverTrigger asChild>
          <DateTrigger {...trigger} empty={!value}>
            {value ? formatDate(value, { era }) : placeholder}
          </DateTrigger>
        </PopoverTrigger>
      </TriggerFrame>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          era={era}
          selected={value}
          defaultMonth={value}
          disabled={disabledDays}
          captionLayout={captionLayout}
          startMonth={startMonth}
          endMonth={endMonth}
          onSelect={(d) => {
            onChange?.(d)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/* ─── DateInput (typeable) ─────────────────────────────────────────────── */

/**
 * Typeable date field with a calendar button. Understands what people type —
 * `1/10/2569`, `01-10-69`, `01102569`, `1 ต.ค. 69`, Thai digits, พ.ศ. or ค.ศ. —
 * and rewrites it as `1 ต.ค. 2569` on blur or Enter. Text that isn't a valid
 * (or allowed) date stays as typed, is marked invalid and reports `undefined`,
 * so a required-field schema can show the message.
 */
function DateInput({
  value,
  onChange,
  onBlur,
  placeholder = "วว/ดด/ปปปป",
  era = "be",
  disabledDays,
  captionLayout,
  startMonth,
  endMonth,
  className,
  id,
  disabled,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
  name,
}: TriggerProps &
  CalendarOptions & {
    value?: Date
    onChange?: (date: Date | undefined) => void
    /** Forwarded from react-hook-form's `field` to mark the field touched */
    onBlur?: () => void
    placeholder?: string
    name?: string
  }) {
  const [open, setOpen] = React.useState(false)
  // null = show the formatted value; a string = what the user is typing
  const [draft, setDraft] = React.useState<string | null>(null)
  const [badDraft, setBadDraft] = React.useState(false)
  const text = draft ?? (value ? formatDate(value, { era }) : "")

  const allowed = (d: Date) => !disabledDays || !dateMatchModifiers(d, disabledDays)

  function commit() {
    if (draft === null) return
    if (draft.trim() === "") {
      setDraft(null)
      setBadDraft(false)
      return onChange?.(undefined)
    }
    const parsed = parseThaiDate(draft, { era })
    if (parsed && allowed(parsed)) {
      setDraft(null)
      setBadDraft(false)
      onChange?.(parsed)
    } else {
      setBadDraft(true)
      onChange?.(undefined)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <InputGroup data-slot="date-input" className={className}>
          <InputGroupInput
            id={id}
            name={name}
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            inputMode="text"
            autoComplete="off"
            aria-invalid={ariaInvalid || badDraft}
            aria-describedby={describedBy}
            className="tabular-nums"
            onChange={(e) => {
              setDraft(e.target.value)
              setBadDraft(false)
            }}
            onBlur={() => {
              commit()
              onBlur?.()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                commit()
              }
              if (e.key === "ArrowDown" && e.altKey) setOpen(true)
            }}
          />
          <InputGroupAddon align="inline-end">
            <PopoverTrigger asChild>
              <InputGroupButton size="icon-xs" disabled={disabled} aria-label="เปิดปฏิทิน">
                <CalendarIcon />
              </InputGroupButton>
            </PopoverTrigger>
          </InputGroupAddon>
        </InputGroup>
      </PopoverAnchor>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          era={era}
          selected={value}
          defaultMonth={value}
          disabled={disabledDays}
          captionLayout={captionLayout}
          startMonth={startMonth}
          endMonth={endMonth}
          onSelect={(d) => {
            setDraft(null)
            setBadDraft(false)
            onChange?.(d)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/* ─── DateRangePicker ──────────────────────────────────────────────────── */

export type DateRangePreset = { key: string; label: string; range: () => { from: Date; to: Date } }

/** Thai government fiscal year: 1 Oct – 30 Sep (ปีงบ 2570 starts 1 ต.ค. 2569) */
const fiscalYearStart = (d: Date) => new Date(d.getMonth() >= 9 ? d.getFullYear() : d.getFullYear() - 1, 9, 1)

/**
 * Standard presets relative to `now` (default: the real current time).
 * Pass a fixed date when the data has a known end, e.g. demos and reports.
 */
export function createDateRangePresets(now: () => Date = () => new Date()): DateRangePreset[] {
  const today = () => startOfDay(now())
  const untilToday = (from: Date) => ({ from, to: endOfDay(today()) })
  return [
    { key: "today", label: "วันนี้", range: () => untilToday(today()) },
    { key: "7d", label: "7 วันล่าสุด", range: () => untilToday(subDays(today(), 6)) },
    { key: "30d", label: "30 วันล่าสุด", range: () => untilToday(subDays(today(), 29)) },
    { key: "mtd", label: "เดือนนี้", range: () => untilToday(startOfMonth(today())) },
    {
      key: "last-month",
      label: "เดือนที่แล้ว",
      range: () => ({ from: startOfMonth(subMonths(today(), 1)), to: endOfMonth(subMonths(today(), 1)) }),
    },
    { key: "qtd", label: "ไตรมาสนี้", range: () => untilToday(startOfQuarter(today())) },
    { key: "ytd", label: "ปีนี้", range: () => untilToday(startOfYear(today())) },
    { key: "fytd", label: "ปีงบประมาณนี้", range: () => untilToday(fiscalYearStart(today())) },
  ]
}

export const defaultDateRangePresets = createDateRangePresets()

function matchPreset(value: DateRange | undefined, presets: DateRangePreset[]) {
  const { from, to } = value ?? {}
  if (!from || !to) return undefined
  return presets.find((p) => {
    const r = p.range()
    return isSameDay(r.from, from) && isSameDay(r.to, to)
  })
}

const ordered = (a: Date, b: Date) => (a <= b ? { from: a, to: b } : { from: b, to: a })

/**
 * Date range with presets. Click a start day, then an end day (either order);
 * the range previews under the pointer (or keyboard focus) and the popover
 * closes once both ends are picked. Presets apply immediately.
 * Two months on desktop, one on mobile.
 */
function DateRangePicker({
  value,
  onChange,
  presets = defaultDateRangePresets,
  placeholder = "เลือกช่วงวันที่",
  era = "be",
  align = "start",
  clearable = true,
  maxDays,
  disabledDays,
  captionLayout,
  startMonth,
  endMonth,
  className,
  ...trigger
}: TriggerProps &
  CalendarOptions & {
    value?: DateRange
    onChange?: (range: DateRange | undefined) => void
    /** Pass `[]` to hide the preset list */
    presets?: DateRangePreset[]
    placeholder?: string
    align?: "start" | "center" | "end"
    /** Show a × to clear the range (default true). Turn off when "no range" isn't a valid state. */
    clearable?: boolean
    /** Longest range allowed, in days (inclusive). Presets longer than this are hidden. */
    maxDays?: number
  }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  // First click picks an anchor; the second click completes the range.
  const [anchor, setAnchor] = React.useState<Date>()
  const [hovered, setHovered] = React.useState<Date>()

  const visiblePresets = maxDays
    ? presets.filter((p) => {
        const r = p.range()
        return differenceInCalendarDays(r.to, r.from) + 1 <= maxDays
      })
    : presets
  const active = matchPreset(value, visiblePresets)

  // While picking, days farther than maxDays from the anchor are off limits
  const disabled: Matcher[] = [
    ...(disabledDays ? [disabledDays].flat() : []),
    ...(anchor && maxDays ? [{ before: subDays(anchor, maxDays - 1) }, { after: addDays(anchor, maxDays - 1) }] : []),
  ]

  const reset = () => {
    setAnchor(undefined)
    setHovered(undefined)
  }
  const commit = (range: DateRange | undefined) => {
    onChange?.(range)
    reset()
    setOpen(false)
  }

  const label = value?.from
    ? value.to && !isSameDay(value.from, value.to)
      ? formatDateRange(value.from, value.to, { era })
      : formatDate(value.from, { era })
    : placeholder

  const preview = anchor ? ordered(anchor, hovered ?? anchor) : undefined
  const previewDays = preview ? differenceInCalendarDays(preview.to, preview.from) + 1 : 0

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <TriggerFrame
        className={className}
        onClear={clearable && value?.from && !trigger.disabled ? () => onChange?.(undefined) : undefined}
      >
        <PopoverTrigger asChild>
          <DateTrigger {...trigger} empty={!value?.from}>
            {active && <span className="text-muted-foreground">{active.label} ·</span>}
            {label}
          </DateTrigger>
        </PopoverTrigger>
      </TriggerFrame>
      <PopoverContent className="flex w-auto flex-col p-0 sm:flex-row" align={align}>
        {visiblePresets.length > 0 && (
          <div
            role="group"
            aria-label="ช่วงเวลาที่ใช้บ่อย"
            className="flex gap-1 overflow-x-auto border-b p-2 [scrollbar-width:none] sm:w-36 sm:flex-col sm:border-r sm:border-b-0"
          >
            {visiblePresets.map((p) => (
              <Button
                key={p.key}
                variant="ghost"
                size="sm"
                aria-pressed={active?.key === p.key}
                className="shrink-0 justify-start aria-pressed:bg-accent aria-pressed:text-accent-foreground"
                onClick={() => commit(p.range())}
              >
                {p.label}
              </Button>
            ))}
          </div>
        )}
        <div className="grid">
          <Calendar
            mode="range"
            era={era}
            numberOfMonths={isMobile ? 1 : 2}
            // with two months side by side, outside days would show the same date twice
            showOutsideDays={isMobile}
            // Two months end on the selected (or current) month — range filters mostly look back
            defaultMonth={isMobile ? value?.from : subMonths(value?.to ?? value?.from ?? new Date(), 1)}
            selected={preview ?? value}
            disabled={disabled}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
            // the in-progress range is lighter than a committed one
            className={cn(anchor && "**:data-range-middle:bg-accent/60!")}
            onDayMouseEnter={(day) => anchor && setHovered(day)}
            onDayFocus={(day) => anchor && setHovered(day)}
            onSelect={(_, day) => {
              if (!anchor) return setAnchor(day)
              const r = ordered(anchor, day)
              commit({ from: startOfDay(r.from), to: endOfDay(r.to) })
            }}
            autoFocus
          />
          <p className="px-3 pb-3 text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {preview
              ? `${formatDateRange(preview.from, preview.to, { era })} · ${previewDays} วัน — เลือกวันสิ้นสุด`
              : maxDays
                ? `เลือกวันเริ่มต้น · สูงสุด ${maxDays} วัน`
                : "เลือกวันเริ่มต้น"}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ─── shared trigger ───────────────────────────────────────────────────── */

/** Positions the optional × next to (not inside) the trigger button — buttons can't nest. */
function TriggerFrame({
  className,
  onClear,
  children,
}: {
  className?: string
  onClear?: () => void
  children: React.ReactNode
}) {
  return (
    <div data-slot="date-picker" className={cn("group/date relative inline-flex", className)}>
      {children}
      {onClear && (
        <Button
          data-slot="date-clear"
          variant="ghost"
          size="icon-xs"
          aria-label="ล้างค่า"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={onClear}
        >
          <CloseCircleIcon />
        </Button>
      )}
    </div>
  )
}

function DateTrigger({
  className,
  empty,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { empty?: boolean }) {
  return (
    <Button
      variant="outline"
      data-empty={empty || undefined}
      className={cn(
        "w-full justify-start gap-2 font-normal tabular-nums data-empty:text-muted-foreground",
        "group-has-[>[data-slot=date-clear]]/date:pr-9",
        "aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/50",
        className
      )}
      {...props}
    >
      <CalendarIcon className="text-muted-foreground" />
      <span className="flex min-w-0 items-center gap-1 truncate">{children}</span>
    </Button>
  )
}

export { DateInput, DatePicker, DateRangePicker }
export type { DateRange }
