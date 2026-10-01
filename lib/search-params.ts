import { createParser } from "nuqs"

import { parseISODate, toISODate } from "@/lib/format"

/**
 * URL search-param parsers for nuqs.
 *
 * `parseAsLocalDate` — `?from=2026-09-01` ↔ local midnight. Use this instead of
 * nuqs' `parseAsIsoDate`, which goes through UTC: in Thailand (UTC+7) local
 * 1 Oct 00:00 would serialise as "2026-09-30".
 */
export const parseAsLocalDate = createParser<Date>({
  parse: (v) => parseISODate(v) ?? null,
  serialize: toISODate,
  eq: (a, b) => a.getTime() === b.getTime(),
})

export type SortValue = { id: string; desc: boolean }

/** `?sort=date.desc` ↔ `{ id: "date", desc: true }` (one column — what a TanStack table sorts by) */
export const parseAsSort = createParser<SortValue>({
  parse: (v) => {
    const m = /^([\w-]+)\.(asc|desc)$/.exec(v)
    return m ? { id: m[1], desc: m[2] === "desc" } : null
  },
  serialize: (s) => `${s.id}.${s.desc ? "desc" : "asc"}`,
  eq: (a, b) => a.id === b.id && a.desc === b.desc,
})
