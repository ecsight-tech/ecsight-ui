"use client"

import { motion } from "motion/react"
import { cn } from "cn"

import { formatDate, formatRelative, formatTime } from "@/lib/format"
import { fadeUp, listStagger } from "@/lib/motion"
import type { StatusTone } from "@/components/ui/status-badge"

export type TimelineItem = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  time: Date
  /** A Solar icon element, e.g. `<DeliveryIcon />`; defaults to a dot */
  icon?: React.ReactNode
  tone?: StatusTone
}

const toneClass: Record<StatusTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-foreground",
  info: "bg-primary/10 text-primary",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
}

/**
 * Activity feed / order history, newest first. Relative time ("3 นาทีที่ผ่านมา")
 * with the exact date-time in the tooltip and `<time dateTime>`. Items stagger in.
 */
function Timeline({ items, now, className }: { items: TimelineItem[]; now?: Date; className?: string }) {
  return (
    <motion.ol
      data-slot="timeline"
      variants={listStagger}
      initial="hidden"
      animate="visible"
      className={cn("grid", className)}
    >
      {items.map((item, i) => (
        <motion.li key={item.id} variants={fadeUp} className="relative flex gap-3 pb-5 last:pb-0">
          {/* connector to the next item */}
          {i < items.length - 1 && (
            <span aria-hidden className="absolute top-8 bottom-1 left-[15px] w-px bg-border" />
          )}
          <span
            className={cn(
              "relative grid size-8 shrink-0 place-items-center rounded-full [&_svg]:size-4",
              toneClass[item.tone ?? "neutral"]
            )}
          >
            {item.icon ?? <span className="size-2 rounded-full bg-current" />}
          </span>
          <div className="grid min-w-0 flex-1 gap-0.5 pt-1.5 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 font-medium">{item.title}</span>
              <time
                dateTime={item.time.toISOString()}
                title={`${formatDate(item.time, { style: "long" })} ${formatTime(item.time)} น.`}
                className="shrink-0 text-xs text-muted-foreground tabular-nums"
              >
                {formatRelative(item.time, now)}
              </time>
            </div>
            {item.description && <p className="text-muted-foreground">{item.description}</p>}
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}

export { Timeline }
