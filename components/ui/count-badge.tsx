"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "cn"

import { duration, ease, spring } from "@/lib/motion"

type CountBadgeProps = {
  count: number
  /** Shows `${max}+` above this */
  max?: number
  className?: string
  /** Accessible description, e.g. "การแจ้งเตือนที่ยังไม่อ่าน" */
  label?: string
}

/**
 * Small count bubble for notifications, inbox, cart. Pops in/out on a bouncy
 * spring; digits roll up when the count grows and down when it shrinks.
 * Hidden entirely at 0.
 */
function CountBadge({ count, max = 99, className, label }: CountBadgeProps) {
  const [prev, setPrev] = React.useState(count)
  const [direction, setDirection] = React.useState(1)
  if (count !== prev) {
    // Derive roll direction during render (React's "adjust state on prop change" pattern)
    setDirection(count > prev ? 1 : -1)
    setPrev(count)
  }

  const text = count > max ? `${max}+` : String(count)

  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          key="count-badge"
          data-slot="count-badge"
          aria-label={label ? `${label} ${text}` : undefined}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: spring.bouncy }}
          exit={{ scale: 0.4, opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
          className={cn(
            "inline-grid h-4 min-w-4 overflow-hidden rounded-full bg-primary px-1 text-[0.625rem] leading-4 font-medium text-primary-foreground tabular-nums",
            className
          )}
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.span
              key={text}
              custom={direction}
              variants={{
                enter: (d: number) => ({ y: d * 10, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: (d: number) => ({ y: d * -10, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring.snappy}
              className="col-start-1 row-start-1 text-center"
              aria-hidden={label ? true : undefined}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export { CountBadge }
