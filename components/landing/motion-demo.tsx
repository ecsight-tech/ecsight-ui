"use client"

import * as React from "react"
import { motion } from "motion/react"
import { RestartIcon } from "@solar-icons/react/linear"

import { spring } from "@/lib/motion"
import { Button } from "@/components/ui/button"

const curves = [
  { key: "snappy", label: "Snappy", use: "Press, toggle, pop-in", t: spring.snappy },
  { key: "gentle", label: "Gentle", use: "Large surfaces, layout", t: spring.gentle },
  { key: "bouncy", label: "Bouncy", use: "Checkmarks, icon swaps", t: spring.bouncy },
] as const

/** The three spring tokens from lib/motion, raced side by side. Honours reduced motion via the app's MotionConfig. */
export function MotionDemo() {
  const [on, setOn] = React.useState(false)

  return (
    <div className="grid gap-4">
      {curves.map((c) => (
        <div key={c.key} className="grid gap-1.5">
          <p className="flex justify-between gap-2 text-sm">
            <span className="font-medium">
              {c.label} <span className="font-mono text-xs font-normal text-muted-foreground">{c.t.stiffness}/{c.t.damping}</span>
            </span>
            <span className="text-xs text-muted-foreground">{c.use}</span>
          </p>
          <div className="relative h-8 rounded-full bg-muted">
            {/* travel area = track minus padding and dot; x: 100% of it lands the dot at the far end */}
            <div className="absolute inset-y-1 right-[1.75rem] left-1">
              <motion.div className="h-full w-full" initial={false} animate={{ x: on ? "100%" : "0%" }} transition={c.t}>
                <div className="size-6 rounded-full bg-primary shadow-sm" />
              </motion.div>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-fit" onClick={() => setOn((v) => !v)}>
        <RestartIcon />
        Replay springs
      </Button>
    </div>
  )
}
