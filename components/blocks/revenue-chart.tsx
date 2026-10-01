"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const config = {
  web: { label: "เว็บไซต์", color: "var(--chart-1)" },
  marketplace: { label: "มาร์เก็ตเพลส", color: "var(--chart-2)" },
} satisfies ChartConfig

type Point = { date: string; web: number; marketplace: number }

/**
 * Block: stacked area chart. By default it has its own 7/14/30-day switcher;
 * pass `rangeSwitcher={false}` when a page-level DateRangePicker already
 * filters `data`. Recharts animates on range change.
 */
export function RevenueChart({
  data,
  rangeSwitcher = true,
  description = "ยอดขายรายวัน (บาท)",
}: {
  data: Point[]
  rangeSwitcher?: boolean
  description?: React.ReactNode
}) {
  const [range, setRange] = React.useState("30")
  const visible = rangeSwitcher ? data.slice(-Number(range)) : data

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายได้ตามช่องทาง</CardTitle>
        <CardDescription>{description}</CardDescription>
        {rangeSwitcher && (
          <CardAction>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={range}
              onValueChange={(v) => v && setRange(v)}
            >
              <ToggleGroupItem value="7">7 วัน</ToggleGroupItem>
              <ToggleGroupItem value="14">14 วัน</ToggleGroupItem>
              <ToggleGroupItem value="30">30 วัน</ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <AreaChart data={visible} margin={{ left: 4, right: 4 }}>
            <defs>
              {(["web", "marketplace"] as const).map((k) => (
                <linearGradient key={k} id={`fill-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${k})`} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={`var(--color-${k})`} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(v: string) =>
                new Date(v).toLocaleDateString("th-TH", { day: "numeric", month: "short" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(v) =>
                    new Date(String(v)).toLocaleDateString("th-TH", { day: "numeric", month: "long" })
                  }
                />
              }
            />
            <Area
              dataKey="marketplace"
              type="natural"
              stackId="a"
              fill="url(#fill-marketplace)"
              stroke="var(--color-marketplace)"
              strokeWidth={2}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Area
              dataKey="web"
              type="natural"
              stackId="a"
              fill="url(#fill-web)"
              stroke="var(--color-web)"
              strokeWidth={2}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
