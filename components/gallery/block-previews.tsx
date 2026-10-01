"use client"

import { Suspense } from "react"

import { kpis, makeOrders, orders, revenueSeries } from "@/lib/demo-data"
import { CustomerSheet } from "@/components/blocks/customer-sheet"
import { KpiCards } from "@/components/blocks/kpi-cards"
import { LoginForm } from "@/components/blocks/login-form"
import { OrdersTable } from "@/components/blocks/orders-table"
import { RevenueChart } from "@/components/blocks/revenue-chart"
import { VirtualTable } from "@/components/blocks/virtual-table"
import { Button } from "@/components/ui/button"

const bulkOrders = makeOrders(10_000)

/** Live previews for /blocks/<slug>. App Shell renders full-screen, so it is shown in an iframe of /demo. */
export function BlockPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "app-shell":
      return (
        <iframe
          src="/demo"
          title="App Shell preview"
          className="h-[640px] w-full rounded-lg border bg-background"
          loading="lazy"
        />
      )
    case "kpi-cards":
      return <KpiCards items={kpis} className="w-full" />
    case "revenue-chart":
      return (
        <div className="w-full max-w-3xl">
          <RevenueChart data={revenueSeries} />
        </div>
      )
    case "orders-table":
      return (
        <div className="w-full">
          {/* reads ?q=&status=&sort=&page= — client-only on this prerendered page */}
          <Suspense>
            <OrdersTable data={orders} />
          </Suspense>
        </div>
      )
    case "virtual-table":
      return (
        <div className="w-full">
          <VirtualTable data={bulkOrders} />
        </div>
      )
    case "customer-sheet":
      return (
        <CustomerSheet>
          <Button>เปิดฟอร์มเพิ่มลูกค้า</Button>
        </CustomerSheet>
      )
    case "login-form":
      return <LoginForm />
    default:
      return null
  }
}
