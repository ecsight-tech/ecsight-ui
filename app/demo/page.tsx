import { Suspense } from "react"
import type { Metadata } from "next"

import { DemoDashboard, DemoDashboardFallback } from "./demo-dashboard"

export const metadata: Metadata = { title: "Demo dashboard" }

// The dashboard reads its date range and table filters from the URL, so it renders
// on the client; the shell + skeleton are prerendered as the fallback.
export default function DemoPage() {
  return (
    <Suspense fallback={<DemoDashboardFallback />}>
      <DemoDashboard />
    </Suspense>
  )
}
