"use client"

import * as React from "react"
import { DayPicker as BuddhistDayPicker } from "@daypicker/buddhist"
import {
  DayPicker,
  getDefaultClassNames,
  type ChevronProps,
  type DayButtonProps,
  type DayPickerProps,
  type MonthCaptionProps,
  type RootProps,
} from "@daypicker/react"
import { th } from "@daypicker/react/locale"
import { addMonths, format, isSameMonth, startOfMonth } from "date-fns"
import { AltArrowDownIcon, AltArrowLeftIcon, AltArrowRightIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"

type Era = "be" | "ce"
type View = "days" | "months" | "years"

type CalendarProps = DayPickerProps & {
  /** Year display: พ.ศ. (default) or ค.ศ. Months and weeks are Gregorian either way. */
  era?: Era
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  /** "วันนี้" button under the grid that jumps back to the current month (default true) */
  showToday?: boolean
}

const localeFor = (era: Era) => (era === "ce" ? "th-TH-u-ca-gregory" : "th-TH")
const yearLabel = (year: number, era: Era) => String(era === "be" ? year + 543 : year)
const YEARS_PER_PAGE = 12

/** Lets the module-level caption open the month/year panel without remounting the grid */
const CalendarContext = React.createContext<{
  era: Era
  captionLayout: CalendarProps["captionLayout"]
  openPanel: (month: Date, displayIndex: number) => void
} | null>(null)

/* Month change: the grid slides in from the side it came from, the caption cross-fades
   (260ms ease-out, no overshoot — keyframes in app/globals.css / the foundation item).
   DayPicker toggles these with classList.add/remove, so each must be ONE class name. */
const animationClassNames = {
  weeks_before_enter: "calendar-weeks-before-enter",
  weeks_after_enter: "calendar-weeks-after-enter",
  weeks_before_exit: "calendar-weeks-before-exit",
  weeks_after_exit: "calendar-weeks-after-exit",
  caption_before_enter: "calendar-caption-enter",
  caption_after_enter: "calendar-caption-enter",
  caption_before_exit: "calendar-caption-exit",
  caption_after_exit: "calendar-caption-exit",
}

/**
 * Month grid on react-day-picker v10. Thai by default: Buddhist Era years
 * (via @daypicker/buddhist), Sunday-first weeks, Arabic digits — matches
 * `formatDate` in lib/format.ts. Pass `era="ce"` for ค.ศ.
 *
 * - Months slide in the direction of travel.
 * - Click the month caption for a month grid, then the year for a year grid —
 *   faster than arrows for far-away dates (birthdays, contracts).
 * - "วันนี้" jumps back to the current month.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  era = "be",
  showToday = true,
  components,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  const d = getDefaultClassNames()
  // Same props either way; the Buddhist build only narrows `locale` to a date-fns Locale.
  const Picker = (era === "be" ? BuddhistDayPicker : DayPicker) as typeof DayPicker

  // The displayed month is controlled here so the panel and "วันนี้" can move it
  const [internalMonth, setInternalMonth] = React.useState(() => startOfMonth(monthProp ?? defaultMonth ?? new Date()))
  const month = monthProp ?? internalMonth
  const setMonth = (m: Date) => {
    const next = clampMonth(startOfMonth(m), startMonth, endMonth)
    setInternalMonth(next)
    onMonthChange?.(next)
  }

  const [view, setView] = React.useState<View>("days")
  // Which month of a multi-month view the panel edits (0 = first)
  const [panel, setPanel] = React.useState({ month, displayIndex: 0 })
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const returnFocus = React.useRef(false)

  React.useEffect(() => {
    if (view === "days" && returnFocus.current) {
      returnFocus.current = false
      // skip the aria-hidden snapshot of the old month that DayPicker keeps during the slide
      const captions = wrapperRef.current?.querySelectorAll<HTMLElement>("[data-slot=calendar-caption]") ?? []
      ;[...captions].find((el) => !el.closest("[aria-hidden=true]"))?.focus()
    }
  }, [view])

  // React Compiler memoises this object; no manual useMemo
  const context = {
    era,
    captionLayout,
    openPanel: (m: Date, displayIndex: number) => {
      setPanel({ month: m, displayIndex })
      setView("months")
    },
  }

  const closePanel = (picked?: Date) => {
    if (picked) setMonth(addMonths(picked, -panel.displayIndex))
    returnFocus.current = true
    setView("days")
  }

  const today = new Date()
  const onCurrentMonth = view === "days" && isSameMonth(month, today)

  return (
    <CalendarContext.Provider value={context}>
      <div
        ref={wrapperRef}
        data-slot="calendar-wrapper"
        className={cn(
          "group/calendar relative w-fit bg-background p-3 [--cell-size:--spacing(9)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
          className,
        )}
      >
        {/* Hidden under the month/year panel with inert + opacity, not `invisible`: buttons
            transition visibility (transition-all), so focus would fail right after reveal. */}
        <div inert={view !== "days"} className={cn(view !== "days" && "opacity-0")}>
          <Picker
            // @daypicker/buddhist ships its own BE-aware Thai locale; ค.ศ. uses the standard one
            {...(era === "ce" && { locale: th })}
            numerals="latn"
            weekStartsOn={0}
            animate
            month={month}
            onMonthChange={setMonth}
            startMonth={startMonth}
            endMonth={endMonth}
            showOutsideDays={showOutsideDays}
            captionLayout={captionLayout}
            classNames={{
              root: cn("w-fit", d.root),
              months: cn("relative flex flex-col gap-4 md:flex-row", d.months),
              month: cn("flex w-full flex-col gap-4", d.month),
              nav: cn("absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between gap-1", d.nav),
              button_previous: cn(
                buttonVariants({ variant: buttonVariant }),
                "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
                d.button_previous,
              ),
              button_next: cn(
                buttonVariants({ variant: buttonVariant }),
                "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
                d.button_next,
              ),
              month_caption: cn(
                "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                d.month_caption,
              ),
              dropdowns: cn(
                "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
                d.dropdowns,
              ),
              dropdown_root: cn(
                "relative rounded-md border border-input has-focus:border-ring has-focus:ring-3 has-focus:ring-ring/50",
                d.dropdown_root,
              ),
              dropdown: cn("absolute inset-0 bg-popover opacity-0", d.dropdown),
              caption_label: cn(
                "font-medium select-none",
                captionLayout === "label"
                  ? "text-sm"
                  : "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
                d.caption_label,
              ),
              month_grid: "w-full border-collapse",
              weekdays: cn("flex", d.weekdays),
              weekday: cn("flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none", d.weekday),
              week: cn("mt-1 flex w-full", d.week),
              week_number_header: cn("w-(--cell-size) select-none", d.week_number_header),
              week_number: cn("text-[0.8rem] text-muted-foreground select-none", d.week_number),
              day: cn(
                "group/day relative aspect-square size-(--cell-size) p-0 text-center select-none",
                "[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
                d.day,
              ),
              range_start: cn("rounded-l-md bg-accent", d.range_start),
              range_middle: cn("rounded-none", d.range_middle),
              range_end: cn("rounded-r-md bg-accent", d.range_end),
              today: cn("rounded-md", d.today),
              outside: cn("text-muted-foreground aria-selected:text-muted-foreground", d.outside),
              disabled: cn("text-muted-foreground opacity-50", d.disabled),
              hidden: cn("invisible", d.hidden),
              ...animationClassNames,
              ...classNames,
            }}
            // Module-level components only: an inline arrow here is a new component type on
            // every render, which remounts the whole grid (and steals focus back to the old day).
            components={{
              Root: CalendarRoot,
              Chevron: CalendarChevron,
              DayButton: CalendarDayButton,
              MonthCaption: CalendarMonthCaption,
              ...components,
            }}
            {...props}
          />
        </div>

        {view !== "days" && (
          <MonthYearPanel
            view={view}
            setView={setView}
            month={panel.month}
            era={era}
            startMonth={startMonth}
            endMonth={endMonth}
            onPick={closePanel}
            onCancel={() => closePanel()}
          />
        )}

        {showToday && (
          <div className="flex pt-2">
            <Button
              variant="ghost"
              size="xs"
              disabled={onCurrentMonth}
              aria-label="ไปที่เดือนปัจจุบัน"
              onClick={() => {
                setView("days")
                setMonth(today)
              }}
            >
              วันนี้
            </Button>
          </div>
        )}
      </div>
    </CalendarContext.Provider>
  )
}

function clampMonth(m: Date, start?: Date, end?: Date) {
  if (start && m < startOfMonth(start)) return startOfMonth(start)
  if (end && m > startOfMonth(end)) return startOfMonth(end)
  return m
}

/* ─── month / year panel ───────────────────────────────────────────────── */

function MonthYearPanel({
  view,
  setView,
  month,
  era,
  startMonth,
  endMonth,
  onPick,
  onCancel,
}: {
  view: "months" | "years"
  setView: (v: View) => void
  month: Date
  era: Era
  startMonth?: Date
  endMonth?: Date
  onPick: (month: Date) => void
  onCancel: () => void
}) {
  const [year, setYear] = React.useState(month.getFullYear())
  // Year pages start on a decade of the *displayed* era (2560–2571, not 2559–2570), then step by 12
  const offset = era === "be" ? 543 : 0
  const [pageStart, setPageStart] = React.useState(() => {
    const shown = month.getFullYear() + offset
    return shown - (shown % 10) - offset
  })
  const ref = React.useRef<HTMLDivElement>(null)
  const now = new Date()

  React.useEffect(() => {
    // focus the selected cell, else the current month/year
    const cell =
      ref.current?.querySelector<HTMLElement>("[aria-pressed=true]") ??
      ref.current?.querySelector<HTMLElement>("[data-current]")
    cell?.focus()
  }, [view])

  const outOfRange = (from: Date, to: Date) =>
    (!!endMonth && from > startOfMonth(endMonth)) || (!!startMonth && to < startOfMonth(startMonth))

  const monthNames = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, m) =>
        new Date(2026, m, 1).toLocaleDateString(localeFor(era), {
          month: "short",
        }),
      ),
    [era],
  )

  const title =
    view === "months"
      ? yearLabel(year, era)
      : `${yearLabel(pageStart, era)} – ${yearLabel(pageStart + YEARS_PER_PAGE - 1, era)}`

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={view === "months" ? "เลือกเดือน" : "เลือกปี"}
      className="absolute inset-3 bottom-auto z-20 flex flex-col gap-3 bg-inherit animate-in fade-in-0 zoom-in-95 duration-(--motion-base) ease-(--ease-out)"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation() // back to days, don't close the popover
          if (view === "years") setView("months")
          else onCancel()
        }
      }}
    >
      <div className="flex h-(--cell-size) items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="size-(--cell-size)"
          aria-label="ก่อนหน้า"
          onClick={() => (view === "months" ? setYear((y) => y - 1) : setPageStart((p) => p - YEARS_PER_PAGE))}
        >
          <AltArrowLeftIcon className="size-4" />
        </Button>
        {view === "months" ? (
          <Button
            variant="ghost"
            size="sm"
            className="tabular-nums"
            onClick={() => setView("years")}
            aria-label={`ปี ${title} — เลือกปี`}
          >
            {title}
            <AltArrowDownIcon className="size-3.5 text-muted-foreground" />
          </Button>
        ) : (
          <span className="text-sm font-medium tabular-nums">{title}</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-(--cell-size)"
          aria-label="ถัดไป"
          onClick={() => (view === "months" ? setYear((y) => y + 1) : setPageStart((p) => p + YEARS_PER_PAGE))}
        >
          <AltArrowRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {view === "months"
          ? monthNames.map((name, m) => {
              const from = new Date(year, m, 1)
              return (
                <PanelCell
                  key={m}
                  selected={from.getTime() === startOfMonth(month).getTime()}
                  current={year === now.getFullYear() && m === now.getMonth()}
                  disabled={outOfRange(from, from)}
                  onClick={() => onPick(from)}
                >
                  {name}
                </PanelCell>
              )
            })
          : Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
              const y = pageStart + i
              return (
                <PanelCell
                  key={y}
                  selected={y === year}
                  current={y === now.getFullYear()}
                  disabled={outOfRange(new Date(y, 0, 1), new Date(y, 11, 1))}
                  onClick={() => {
                    setYear(y)
                    setView("months")
                  }}
                >
                  {yearLabel(y, era)}
                </PanelCell>
              )
            })}
      </div>
    </div>
  )
}

function PanelCell({
  selected,
  current,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  selected: boolean
  current: boolean
}) {
  return (
    <Button
      variant="ghost"
      aria-pressed={selected}
      data-current={current || undefined}
      className={cn(
        "h-10 font-normal tabular-nums",
        "data-current:font-semibold data-current:text-primary",
        "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/85",
        className,
      )}
      {...props}
    />
  )
}

/* ─── DayPicker component overrides (module level — see note above) ────── */

function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return <div data-slot="calendar" ref={rootRef} className={className} {...props} />
}

function CalendarChevron({ className, orientation }: ChevronProps) {
  const Icon =
    orientation === "left" ? AltArrowLeftIcon : orientation === "right" ? AltArrowRightIcon : AltArrowDownIcon
  return <Icon className={cn("size-4", className)} />
}

/** Caption as a button that opens the month/year panel (label layout only; dropdowns render as usual) */
function CalendarMonthCaption({ calendarMonth, displayIndex, children, ...props }: MonthCaptionProps) {
  const ctx = React.useContext(CalendarContext)
  if (!ctx || ctx.captionLayout !== "label") return <div {...props}>{children}</div>
  const date = calendarMonth.date
  const label = date.toLocaleDateString(localeFor(ctx.era), {
    month: "long",
    year: "numeric",
  })
  return (
    <div {...props}>
      <Button
        data-slot="calendar-caption"
        variant="ghost"
        size="sm"
        className="relative z-20 gap-1 font-medium"
        aria-label={`${label} — เลือกเดือนและปี`}
        onClick={() => ctx.openPanel(date, displayIndex)}
      >
        <span aria-live="polite">{label}</span>
        <AltArrowDownIcon className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
}

function CalendarDayButton({ className, day, modifiers, ...props }: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const single = modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={format(day.date, "yyyy-MM-dd")}
      data-today={modifiers.today || undefined}
      data-selected-single={single || undefined}
      data-range-start={modifiers.range_start || undefined}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      className={cn(
        // bg-clip-border: Button clips its fill inside a transparent border, which would leave gaps in a range band
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 bg-clip-border leading-none font-normal tabular-nums",
        // today: brand text + dot underneath (keeps the fill free for selection)
        "data-today:font-semibold data-today:text-primary data-today:after:absolute data-today:after:bottom-1 data-today:after:size-1 data-today:after:rounded-full data-today:after:bg-current",
        // arbitrary variant: a bare `data-selected-single:` collides with the `data-selected` custom variant
        "data-[selected-single]:bg-primary data-[selected-single]:text-primary-foreground data-[selected-single]:hover:bg-primary/85",
        "data-range-start:bg-primary data-range-start:text-primary-foreground data-range-start:rounded-md data-range-start:rounded-l-md",
        "data-range-end:bg-primary data-range-end:text-primary-foreground data-range-end:rounded-md data-range-end:rounded-r-md",
        "data-range-middle:rounded-none data-range-middle:bg-accent data-range-middle:text-accent-foreground",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-3 group-data-[focused=true]/day:ring-ring/50",
        "dark:hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton, type CalendarProps }
