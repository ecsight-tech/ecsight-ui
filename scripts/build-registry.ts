/**
 * Generates registry.json from lib/catalog.ts + the source files themselves.
 * Run via `pnpm registry:build` (this script, then `shadcn build` → public/r).
 *
 * - npm dependencies are read from each file's bare imports
 * - registryDependencies are read from `@/components/ui/*` imports
 * - `@/hooks/*` and `@/lib/*` (except utils/motion) files are bundled into the item
 * - every item depends on @ecsight/foundation (tokens, motion, fonts, providers)
 */
import fs from "node:fs"
import path from "node:path"

import { blocks, components, type CatalogItem } from "../lib/catalog.ts"

const root = path.resolve(import.meta.dirname, "..")
const NS = "@ecsight"
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf8")

// ─── import analysis ────────────────────────────────────────────────────
const IGNORED_PACKAGES = new Set(["react", "react-dom", "next", "server-only"])

function importsOf(file: string) {
  return [...read(file).matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1])
}

function packageName(spec: string) {
  const parts = spec.split("/")
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

// A file belongs to the item named after it (popover.tsx → popover), else the first item listing it
const fileOwner = new Map<string, string>()
for (const item of components) for (const f of item.files) if (!fileOwner.has(f)) fileOwner.set(f, item.slug)
for (const item of components) for (const f of item.files) if (path.basename(f, ".tsx") === item.slug) fileOwner.set(f, item.slug)

function fileType(f: string, itemType: string) {
  if (f.startsWith("components/ui/")) return "registry:ui"
  if (f.startsWith("hooks/")) return "registry:hook"
  if (f.startsWith("lib/")) return "registry:lib"
  return itemType === "registry:block" ? "registry:component" : "registry:component"
}

function resolveLocal(spec: string) {
  const base = spec.replace(/^@\//, "")
  for (const ext of [".ts", ".tsx"]) if (fs.existsSync(path.join(root, base + ext))) return base + ext
  return null
}

function buildItem(item: CatalogItem, type: "registry:ui" | "registry:block") {
  const files = new Set(item.files)
  const deps = new Set<string>()
  const registryDeps = new Set<string>([`${NS}/foundation`])

  const queue = [...files]
  while (queue.length) {
    const f = queue.shift()!
    for (const spec of importsOf(f)) {
      if (spec.startsWith("@/")) {
        const local = resolveLocal(spec)
        if (!local || local === "lib/utils.ts" || local === "lib/motion.ts") continue
        if (local.startsWith("components/ui/")) {
          const owner = fileOwner.get(local)
          if (owner && owner !== item.slug && !files.has(local)) registryDeps.add(`${NS}/${owner}`)
        } else if (!files.has(local)) {
          files.add(local)
          queue.push(local)
        }
      } else if (!spec.startsWith(".")) {
        const pkg = packageName(spec)
        if (!IGNORED_PACKAGES.has(pkg)) deps.add(pkg)
      }
    }
  }

  return {
    name: item.slug,
    type,
    title: item.title,
    description: item.motion ? `${item.description} Motion: ${item.motion}` : item.description,
    dependencies: [...deps].sort(),
    registryDependencies: [...registryDeps].sort(),
    files: [...files].map((f) => ({ path: f, type: fileType(f, type) })),
  }
}

// ─── foundation: tokens from app/globals.css ────────────────────────────
function cssBlock(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`Missing ${selector} block in globals.css`)
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("\n}", start))
  return Object.fromEntries(
    [...body.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim().replace(/\s+/g, " ")])
  )
}

const css = read("app/globals.css")
const themeInline = cssBlock(css, "@theme inline")
const ecsightThemeKeys = [
  "font-sans",
  "font-mono",
  "color-brand",
  "color-success",
  "color-warning",
  "color-warning-foreground",
  "ease-out",
  "ease-in",
  "ease-spring",
  // Thai-first line heights (see app/globals.css)
  ...["xs", "sm", "base", "lg", "xl", "2xl", "3xl"].map((s) => `text-${s}--line-height`),
]

const fonts = [
  { name: "font-plex-sans", family: "IBM Plex Sans", import: "IBM_Plex_Sans", variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] },
  { name: "font-plex-thai", family: "IBM Plex Sans Thai Looped", import: "IBM_Plex_Sans_Thai_Looped", variable: "--font-plex-thai", subsets: ["thai"], weight: ["400", "500", "600", "700"] },
  { name: "font-plex-mono", family: "IBM Plex Mono", import: "IBM_Plex_Mono", variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] },
]

const foundation = {
  name: "foundation",
  type: "registry:style",
  title: "Ecsight Foundation",
  description:
    "Brand tokens (OKLCH, light/dark), motion tokens + presets, IBM Plex Sans/Thai fonts, Solar icons, providers. Install first.",
  dependencies: ["motion", "@solar-icons/react", "next-themes", "sonner", "cn", "nuqs"],
  registryDependencies: [...fonts.map((f) => `${NS}/${f.name}`), `${NS}/toast`, `${NS}/tooltip`],
  files: [
    { path: "lib/motion.ts", type: "registry:lib" },
    { path: "components/providers.tsx", type: "registry:component" },
  ],
  cssVars: {
    theme: Object.fromEntries(ecsightThemeKeys.map((k) => [k, themeInline[k]])),
    light: cssBlock(css, ":root"),
    dark: cssBlock(css, ".dark"),
  },
  css: {
    "@layer base": {
      ":lang(th)": { "line-height": "1.65" },
      '[data-density="compact"]': { "--control-h": "2rem", "--table-head-h": "2.25rem", "--table-cell-py": "0.25rem" },
      '[data-slot="table"], [data-numeric]': { "font-variant-numeric": "tabular-nums" },
    },
    "@layer components": {
      '[data-slot$="-content"][data-state="open"], [data-slot$="-content"][data-state="delayed-open"], [data-slot$="-content"][data-state="instant-open"]':
        { "--tw-animation-duration": "var(--motion-spring)", "--tw-ease": "var(--ease-spring)" },
      '[data-slot$="-content"][data-state="closed"]': { "--tw-animation-duration": "var(--motion-fast)", "--tw-ease": "var(--ease-in)" },
      '[data-slot="sheet-content"][data-state="open"]': { "--tw-animation-duration": "var(--motion-slow)", "--tw-ease": "var(--ease-out)" },
      '[data-slot$="-overlay"][data-state]': { "--tw-animation-duration": "var(--motion-base)", "--tw-ease": "var(--ease-out)" },
      '[data-slot="accordion-content"][data-state], [data-slot="collapsible-content"][data-state]': {
        "--tw-animation-duration": "var(--motion-slow)",
        "--tw-ease": "var(--ease-out)",
      },
      '[data-slot="field"][data-invalid="true"]': { animation: "field-shake 320ms var(--ease-out)" },
      // Calendar month change — single classes toggled by react-day-picker
      ".calendar-weeks-before-enter": { animation: "calendar-in-left var(--motion-slow) var(--ease-out) forwards" },
      ".calendar-weeks-after-enter": { animation: "calendar-in-right var(--motion-slow) var(--ease-out) forwards" },
      ".calendar-weeks-before-exit": { animation: "calendar-out-left var(--motion-slow) var(--ease-out) forwards" },
      ".calendar-weeks-after-exit": { animation: "calendar-out-right var(--motion-slow) var(--ease-out) forwards" },
      ".calendar-caption-enter": { animation: "calendar-fade-in var(--motion-slow) var(--ease-out) forwards" },
      ".calendar-caption-exit": { animation: "calendar-fade-out var(--motion-slow) var(--ease-out) forwards" },
    },
    "@keyframes calendar-in-left": { from: { transform: "translateX(-100%)", opacity: "0" }, to: { transform: "none", opacity: "1" } },
    "@keyframes calendar-in-right": { from: { transform: "translateX(100%)", opacity: "0" }, to: { transform: "none", opacity: "1" } },
    "@keyframes calendar-out-left": { from: { transform: "none", opacity: "1" }, to: { transform: "translateX(-100%)", opacity: "0" } },
    "@keyframes calendar-out-right": { from: { transform: "none", opacity: "1" }, to: { transform: "translateX(100%)", opacity: "0" } },
    "@keyframes calendar-fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
    "@keyframes calendar-fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
    "@keyframes field-shake": {
      "0%, 100%": { transform: "translateX(0)" },
      "20%": { transform: "translateX(-4px)" },
      "40%": { transform: "translateX(4px)" },
      "60%": { transform: "translateX(-2px)" },
      "80%": { transform: "translateX(2px)" },
    },
    "@media (prefers-reduced-motion: reduce)": {
      "*, *::before, *::after": {
        "animation-duration": "1ms !important",
        "animation-iteration-count": "1 !important",
        "transition-duration": "1ms !important",
        "scroll-behavior": "auto !important",
      },
    },
  },
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "ecsight",
  homepage: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecsight-design-system.vercel.app",
  items: [
    foundation,
    ...fonts.map(({ name, ...font }) => ({
      name,
      type: "registry:font",
      title: font.family,
      font: { ...font, provider: "google" },
    })),
    ...components.map((c) => buildItem(c, "registry:ui")),
    ...blocks.map((b) => buildItem(b, "registry:block")),
  ],
}

fs.writeFileSync(path.join(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n")
console.log(`registry.json: ${registry.items.length} items`)
