"use client"

import { motion } from "motion/react"
import { Area, AreaChart, YAxis } from "recharts"
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
  /** Recent values, oldest first — drawn as a sparkline (≥ 2 points) */
  trend?: readonly number[]
}

/** Tiny trend line, coloured like the delta. Decorative: the number and delta carry the meaning. */
function Sparkline({ id, data, up }: { id: string; data: readonly number[]; up: boolean }) {
  const color = up ? "var(--success)" : "var(--destructive)"
  const points = data.map((v, i) => ({ i, v }))
  return (
    <div aria-hidden className="h-10 w-24 shrink-0">
      <AreaChart width={96} height={40} data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area
          dataKey="v"
          type="monotone"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${id})`}
          isAnimationActive
          animationDuration={600}
          animationEasing="ease-out"
          dot={false}
        />
      </AreaChart>
    </div>
  )
}

/** Block: a row of KPI cards. Numbers count up on a spring; cards stagger in; optional sparkline per card. */
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
              <CardContent className="flex items-end justify-between gap-2">
                <div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                      up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {up ? <ArrowRightUpIcon className="size-3.5" /> : <ArrowRightDownIcon className="size-3.5" />}
                    {up ? "+" : ""}
                    {kpi.delta.toFixed(1)}%
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">เทียบเดือนก่อน</span>
                </div>
                {kpi.trend && kpi.trend.length > 1 && <Sparkline id={kpi.key} data={kpi.trend} up={up} />}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
