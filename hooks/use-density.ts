"use client"

import * as React from "react"

import { useLocalStorage } from "@/hooks/use-local-storage"

export type Density = "comfortable" | "compact"

export const DENSITY_STORAGE_KEY = "ecsight:density"

/**
 * Inline in <head> (see app/layout.tsx) so the saved density applies before
 * first paint — otherwise compact users would see the page jump on load.
 */
export const densityScript = `try{var d=JSON.parse(localStorage.getItem("${DENSITY_STORAGE_KEY}"));if(d==="compact")document.documentElement.dataset.density=d}catch(e){}`

/**
 * Per-viewer density. "compact" sets `data-density` on <html>, which swaps
 * the --control-h / --table-* tokens (36 → 32px controls, tighter rows).
 */
export function useDensity() {
  const [density, setDensity] = useLocalStorage<Density>(DENSITY_STORAGE_KEY, "comfortable")

  React.useEffect(() => {
    const root = document.documentElement
    if (density === "compact") root.dataset.density = "compact"
    else delete root.dataset.density
  }, [density])

  return [density, setDensity] as const
}
