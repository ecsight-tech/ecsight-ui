import { defineConfig } from "@playwright/test"

const PORT = 3300

/**
 * UI checks for every gallery page: axe (WCAG 2.2 AA, serious/critical must be 0)
 * + visual snapshots, in light/dark × desktop/mobile. Runs against a production
 * build (`pnpm test:ui` builds first). Uses the installed Chrome.
 */
export default defineConfig({
  testDir: "tests/ui",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  snapshotPathTemplate: "{testDir}/__snapshots__/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    reducedMotion: "reduce",
    locale: "th-TH",
    timezoneId: "Asia/Bangkok",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
