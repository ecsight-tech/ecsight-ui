"use client"

import * as React from "react"
import { animate, useInView, useMotionValue, useReducedMotion, useTransform, motion } from "motion/react"
import { cn } from "cn"

import { ease } from "@/lib/motion"

type AnimatedNumberProps = Omit<React.ComponentProps<typeof motion.span>, "children"> & {
  value: number
  /** Passed to Intl.NumberFormat — e.g. { style: "currency", currency: "THB" } */
  format?: Intl.NumberFormatOptions
  locale?: string
}

/** Counts up to `value` when it first scrolls into view and whenever it changes. */
function AnimatedNumber({ value, format, locale = "th-TH", className, ...props }: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const formatter = React.useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0, ...format }),
    [locale, format]
  )
  const text = useTransform(mv, (v) => formatter.format(v))

  React.useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(value)
      return
    }
    // Ease-out tween, not a spring: a counter must never overshoot its real value
    const controls = animate(mv, value, { duration: 0.9, ease: ease.out })
    return () => controls.stop()
  }, [inView, reduce, value, mv])

  return (
    <motion.span ref={ref} data-slot="animated-number" data-numeric className={cn("tabular-nums", className)} {...props}>
      {text}
    </motion.span>
  )
}

export { AnimatedNumber }
