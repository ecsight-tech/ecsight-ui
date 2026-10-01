"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { AddCircleIcon, CloseIcon, InfoCircleIcon, RefreshIcon } from "@solar-icons/react/linear"
import { endOfDay, isWithinInterval, parseISO, startOfDay } from "date-fns"
import { useQueryStates } from "nuqs"

import { fadeUp, listStagger, spring } from "@/lib/motion"
import { formatDateRange } from "@/lib/format"
import { parseAsLocalDate } from "@/lib/search-params"
import { DEMO_TODAY, kpis, orders, revenueSeries } from "@/lib/demo-data"
import { AppShell } from "@/components/blocks/app-shell"
import { CustomerSheet } from "@/components/blocks/customer-sheet"
import { KpiCards } from "@/components/blocks/kpi-cards"
import { OrdersTable } from "@/components/blocks/orders-table"
import { RevenueChart } from "@/components/blocks/revenue-chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createDateRangePresets, DateRangePicker, type DateRange } from "@/components/ui/date-picker"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const activity = [
  { who: "สมชาย ใจดี", initials: "สจ", what: "ชำระเงินคำสั่งซื้อ ORD-24081", when: "2 นาทีที่แล้ว" },
  { who: "Nattaya K.", initials: "NK", what: "สมัครสมาชิกผ่าน LINE OA", when: "18 นาทีที่แล้ว" },
  { who: "ร้านกาแฟดอยสูง", initials: "ดส", what: "ขอใบกำกับภาษีเต็มรูป", when: "1 ชม. ที่แล้ว" },
  { who: "Thanakorn W.", initials: "TW", what: "ขอคืนเงิน ORD-24109", when: "3 ชม. ที่แล้ว" },
]

// Presets count back from the last day of the sample data, so they always have rows
const presets = createDateRangePresets(() => DEMO_TODAY)
const defaultRange = presets.find((p) => p.key === "30d")!.range()

const inRange = (iso: string, range: DateRange | undefined) =>
  !range?.from || !range.to || isWithinInterval(parseISO(iso), { start: range.from, end: range.to })

export function DemoDashboard() {
  // ?from=2026-09-01&to=2026-09-30 — left out of the URL while it equals the default
  const [url, setUrl] = useQueryStates({
    from: parseAsLocalDate.withDefault(startOfDay(defaultRange.from)),
    to: parseAsLocalDate.withDefault(startOfDay(defaultRange.to)),
  })
  // nuqs hands back new Date objects on every URL change; key on the time so `range`
  // (and the filtered data below) only change when the dates do. Otherwise the table
  // sees "new data", resets its page, writes the URL, and loops.
  const fromTime = url.from.getTime()
  const toTime = url.to.getTime()
  const range: DateRange = React.useMemo(
    () => ({ from: new Date(fromTime), to: endOfDay(new Date(toTime)) }),
    [fromTime, toTime]
  )
  const setRange = (r: DateRange | undefined) =>
    r?.from && setUrl({ from: startOfDay(r.from), to: startOfDay(r.to ?? r.from) })
  const visibleOrders = React.useMemo(() => orders.filter((o) => inRange(o.date, range)), [range])
  const visibleRevenue = React.useMemo(() => revenueSeries.filter((p) => inRange(p.date, range)), [range])
  const rangeLabel = range?.from && range.to ? formatDateRange(range.from, range.to) : "ทุกช่วงเวลา"
  const [loading, setLoading] = React.useState(false)
  const [notice, setNotice] = React.useState(true)
  const [view, setView] = React.useState("overview")

  function refresh() {
    setLoading(true)
    setTimeout(() => setLoading(false), 1100)
  }

  return (
    <AppShell breadcrumb={["Ecsight", "ภาพรวม"]} onNavigate={setView}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">สวัสดีตอนเช้า, ปิยะ</h1>
          <p className="text-sm text-muted-foreground">สรุปภาพรวมร้านค้าของคุณ {rangeLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DateRangePicker value={range} onChange={setRange} presets={presets} align="end" clearable={false} />
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshIcon className={loading ? "animate-spin" : undefined} />
            รีเฟรช
          </Button>
          <CustomerSheet>
            <Button>
              <AddCircleIcon />
              เพิ่มลูกค้า
            </Button>
          </CustomerSheet>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {notice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: spring.gentle }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
            className="overflow-hidden"
          >
            <Alert className="relative pr-12">
              <InfoCircleIcon />
              <AlertTitle>ปิดปรับปรุงระบบชำระเงิน 3 ต.ค. 02:00–04:00 น.</AlertTitle>
              <AlertDescription>คำสั่งซื้อช่วงเวลาดังกล่าวจะถูกบันทึกเป็น “รอชำระ” และประมวลผลอัตโนมัติภายหลัง</AlertDescription>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2"
                aria-label="ปิดประกาศ"
                onClick={() => setNotice(false)}
              >
                <CloseIcon />
              </Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {view !== "overview" && view !== "orders" ? (
        <Card>
          <CardHeader>
            <CardTitle>หน้านี้เป็นตัวอย่าง</CardTitle>
            <CardDescription>
              เมนูด้านซ้ายใช้สาธิต animation ของ active indicator และ icon swap — ลองกลับไปที่ “ภาพรวม”
            </CardDescription>
          </CardHeader>
        </Card>
      ) : loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {view === "overview" && (
            <>
              <KpiCards items={kpis} />
              <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RevenueChart data={visibleRevenue} rangeSwitcher={false} description={`ยอดขายรายวัน (บาท) · ${rangeLabel}`} />
                </div>
                <SideCard />
              </div>
            </>
          )}
          <section className="grid gap-3">
            <div>
              <h2 className="text-lg font-semibold">คำสั่งซื้อล่าสุด</h2>
              <p className="text-sm text-muted-foreground">ค้นหา กรอง และเลือกหลายรายการเพื่อจัดการพร้อมกัน</p>
            </div>
            <OrdersTable data={visibleOrders} />
          </section>
        </>
      )}
    </AppShell>
  )
}

function SideCard() {
  return (
    <Card>
      <Tabs defaultValue="activity" className="gap-4">
        <CardHeader>
          <TabsList className="w-full">
            <TabsTrigger value="activity">กิจกรรม</TabsTrigger>
            <TabsTrigger value="goal">เป้าหมาย</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="activity">
            <motion.ul variants={listStagger} initial="hidden" animate="visible" className="grid gap-4">
              {activity.map((a) => (
                <motion.li key={a.what} variants={fadeUp} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{a.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 gap-0.5 text-sm">
                    <span className="truncate">
                      <span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{a.when}</span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </TabsContent>
          <TabsContent value="goal" className="grid gap-5">
            {[
              { label: "ยอดขายเดือนนี้", value: 78, hint: "฿1.28M / ฿1.65M" },
              { label: "ลูกค้าใหม่", value: 48, hint: "482 / 1,000" },
              { label: "ความพึงพอใจ", value: 92, hint: "4.6 / 5" },
            ].map((g) => (
              <div key={g.label} className="grid gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{g.label}</span>
                  <span className="text-muted-foreground tabular-nums">{g.hint}</span>
                </div>
                <GoalProgress value={g.value} label={g.label} />
              </div>
            ))}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

/** Progress fills from 0 on mount so the value reads as "progress", not a static bar */
function GoalProgress({ value, label }: { value: number; label: string }) {
  const [v, setV] = React.useState(0)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setV(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  return <Progress value={v} aria-label={label} />
}

/** Suspense fallback while the URL state (date range, table filters) is read on the client */
export function DemoDashboardFallback() {
  return (
    <AppShell breadcrumb={["Ecsight", "ภาพรวม"]}>
      <DashboardSkeleton />
    </AppShell>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6" aria-busy="true" aria-label="กำลังโหลด">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[126px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <Skeleton className="h-[380px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[380px] rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  )
}
