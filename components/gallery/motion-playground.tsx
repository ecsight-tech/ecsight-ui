"use client"

import * as React from "react"
import { motion } from "motion/react"
import { PlayIcon } from "@solar-icons/react/linear"

import { duration, ease, spring } from "@/lib/motion"
import { Button } from "@/components/ui/button"

const tracks = [
  { name: "spring.snappy", note: "default · press, toggle, pop-in", transition: spring.snappy },
  { name: "spring.gentle", note: "large surfaces, layout", transition: spring.gentle },
  { name: "spring.bouncy", note: "icon swaps, checkmarks", transition: spring.bouncy },
  { name: "ease.out · slow", note: "edge panels, progress, counters", transition: { duration: duration.slow, ease: ease.out } },
] as const

/** Side-by-side comparison of the motion tokens in lib/motion.ts. */
export function MotionPlayground() {
  const [on, setOn] = React.useState(false)
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {tracks.map((t) => (
          <div key={t.name} className="grid grid-cols-[9rem_1fr] items-center gap-4 sm:grid-cols-[13rem_1fr]">
            <div className="grid">
              <code className="font-mono text-xs">{t.name}</code>
              <span className="text-xs text-muted-foreground">{t.note}</span>
            </div>
            <div className="relative h-10 rounded-lg bg-muted">
              <motion.div
                className="absolute top-1 left-1 size-8 rounded-md bg-primary shadow-sm"
                animate={{ left: on ? "calc(100% - 2.25rem)" : "0.25rem" }}
                transition={t.transition}
              />
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="justify-self-start" onClick={() => setOn((v) => !v)}>
        <PlayIcon />
        เล่น animation
      </Button>
    </div>
  )
}
