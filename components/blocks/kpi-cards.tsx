"use client"

import { motion } from "motion/react"
import { ArrowRightDownIcon, ArrowRightUpIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { fadeUp, listStagger } from "@/lib/motion"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type Kpi = {
  key: string
  label: string
  value: number
  /** Percent change vs previous period */
  delta: number
  format?: Intl.NumberFormatOptions
}

/** Block: a row of KPI cards. Numbers count up on a spring; cards stagger in. */
export function KpiCards({ items, className }: { items: readonly Kpi[]; className?: string }) {
  return (
    <motion.div
      variants={listStagger}
      initial="hidden"
      animate="visible"
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
    >
      {items.map((kpi) => {
        const up = kpi.delta >= 0
        return (
          <motion.div key={kpi.key} variants={fadeUp}>
            <Card className="gap-2">
              <CardHeader>
                <CardDescription>{kpi.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  <AnimatedNumber value={kpi.value} format={kpi.format} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                    up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}
                >
                  {up ? <ArrowRightUpIcon className="size-3.5" /> : <ArrowRightDownIcon className="size-3.5" />}
                  {up ? "+" : ""}
                  {kpi.delta.toFixed(1)}%
                </span>
                <span className="ml-2 text-xs text-muted-foreground">เทียบเดือนก่อน</span>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
