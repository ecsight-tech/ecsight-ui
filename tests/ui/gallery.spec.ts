import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import { blocks, components } from "../../lib/catalog"

// Dates in the UI (calendar "today", relative times, presets) are frozen here so snapshots don't drift daily
const FIXED_NOW = new Date("2026-10-01T10:00:00+07:00")

const pages = [
  { name: "home", path: "/" },
  { name: "docs", path: "/docs" },
  { name: "demo", path: "/demo" },
  ...components.map((c) => ({ name: `components-${c.slug}`, path: `/docs/components/${c.slug}` })),
  ...blocks.map((b) => ({ name: `blocks-${b.slug}`, path: `/docs/blocks/${b.slug}` })),
]

for (const theme of ["light", "dark"] as const) {
  test.describe(theme, () => {
    for (const p of pages) {
      test(p.name, async ({ page }, info) => {
        await page.clock.setFixedTime(FIXED_NOW)
        await page.addInitScript((t) => window.localStorage.setItem("theme", t), theme)
        await page.goto(p.path)
        await page.waitForLoadState("networkidle")
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(700) // chart draw-in (JS-driven, not covered by animations: "disabled")

        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze()
        const blocking = violations
          .filter((v) => v.impact === "serious" || v.impact === "critical")
          .map((v) => `${v.id} (${v.nodes.length}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)
        expect(blocking, "axe serious/critical violations").toEqual([])

        await expect(page).toHaveScreenshot(`${p.name}-${theme}-${info.project.name}.png`)
      })
    }
  })
}
