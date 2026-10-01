/**
 * Ecsight formatters — the one place dates, money and relative times are
 * turned into Thai copy. `th-TH` uses the Buddhist calendar (พ.ศ.) and Arabic
 * digits by default; pass `era: "ce"` for ค.ศ.
 */

type Era = "be" | "ce"
type DateInput = Date | string | number

const localeFor = (era: Era) => (era === "ce" ? "th-TH-u-ca-gregory" : "th-TH")
const toDate = (d: DateInput) => (d instanceof Date ? d : new Date(d))

const dateStyles = {
  /** 1 ต.ค. 69 */
  short: { day: "numeric", month: "short", year: "2-digit" },
  /** 1 ต.ค. 2569 */
  medium: { day: "numeric", month: "short", year: "numeric" },
  /** 1 ตุลาคม 2569 */
  long: { day: "numeric", month: "long", year: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>

export type DateStyle = keyof typeof dateStyles

export function formatDate(d: DateInput, { style = "medium", era = "be" }: { style?: DateStyle; era?: Era } = {}) {
  return toDate(d).toLocaleDateString(localeFor(era), dateStyles[style])
}

/** "1–7 ต.ค. 2569", "28 ก.ย. – 4 ต.ค. 2569" — collapses shared month/year. */
export function formatDateRange(from: DateInput, to: DateInput, { era = "be" }: { era?: Era } = {}) {
  return new Intl.DateTimeFormat(localeFor(era), dateStyles.medium).formatRange(toDate(from), toDate(to))
}

/** 14:05 */
export function formatTime(d: DateInput) {
  return toDate(d).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
}

const thb = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 })
const thbSatang = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 2 })

/** ฿1,284,500 — pass `satang: true` for ฿1,284,500.00 */
export function formatTHB(n: number, { satang = false }: { satang?: boolean } = {}) {
  return (satang ? thbSatang : thb).format(n)
}

const relative = new Intl.RelativeTimeFormat("th", { numeric: "auto" })
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
]

/** "3 นาทีที่ผ่านมา", "เมื่อวาน", "ในอีก 2 วัน"; under a minute → "เมื่อสักครู่". */
export function formatRelative(d: DateInput, now: DateInput = Date.now()) {
  const seconds = (toDate(d).getTime() - toDate(now).getTime()) / 1000
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return "เมื่อสักครู่"
}

/* ─── Date ↔ string for APIs and inputs ──────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * "2026-10-01" from the **local** calendar day. Use this for API payloads and
 * URLs — `date.toISOString()` goes through UTC, so local midnight in Thailand
 * (UTC+7) would come out as the previous day.
 */
export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** "2026-10-01" → local midnight (not UTC, unlike `new Date("2026-10-01")`). Invalid → undefined. */
export function parseISODate(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  return m ? safeDate(Number(m[1]), Number(m[2]), Number(m[3])) : undefined
}

function safeDate(y: number, m: number, d: number) {
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : undefined
}

// Thai month names as Intl prints them — short ("ต.ค.") and long ("ตุลาคม"), dots optional
const thaiMonths = Array.from({ length: 12 }, (_, m) => {
  const d = new Date(2026, m, 1)
  return [d.toLocaleDateString("th-TH", { month: "short" }), d.toLocaleDateString("th-TH", { month: "long" })].map(
    (s) => s.replace(/\./g, "")
  )
})

/** Resolve a typed year: ≥ 2400 is พ.ศ.; 2 digits follow `era` (69 → 2569 → 2026, or 26 → 2026). */
function toCE(year: string, era: Era) {
  const y = Number(year)
  if (year.length <= 2) return era === "be" ? 2500 + y - 543 : 2000 + y
  return y >= 2400 ? y - 543 : y
}

/**
 * Parse what people actually type into a date field. Accepts Thai or Arabic
 * digits, พ.ศ. or ค.ศ. (a 4-digit year ≥ 2400 is พ.ศ.), and:
 * `1/10/2569` · `01-10-69` · `1.10.2026` · `01102569` · `1 ต.ค. 2569` · `1 ตุลาคม 69` · `2026-10-01`.
 * Returns local midnight, or undefined when the text isn't a real date.
 */
export function parseThaiDate(input: string, { era = "be" }: { era?: Era } = {}): Date | undefined {
  const s = input
    .trim()
    .replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50))
    .replace(/\s+/g, " ")
  if (!s) return undefined

  const iso = parseISODate(s)
  if (iso) return iso

  let m = /^(\d{1,2})[/\-. ](\d{1,2})[/\-. ](\d{2}|\d{4})$/.exec(s)
  if (m) return safeDate(toCE(m[3], era), Number(m[2]), Number(m[1]))

  m = /^(\d{2})(\d{2})(\d{2}|\d{4})$/.exec(s)
  if (m) return safeDate(toCE(m[3], era), Number(m[2]), Number(m[1]))

  m = /^(\d{1,2}) ?([ก-๛.]+) ?(\d{2}|\d{4})$/.exec(s)
  if (m) {
    const name = m[2].replace(/\./g, "")
    const month = thaiMonths.findIndex((names) => names.includes(name))
    if (month >= 0) return safeDate(toCE(m[3], era), month + 1, Number(m[1]))
  }
  return undefined
}
