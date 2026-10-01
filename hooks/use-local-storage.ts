"use client"

import * as React from "react"

const EVENT = "ecsight:local-storage"

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange) // other tabs
  window.addEventListener(EVENT, onChange) // this tab
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(EVENT, onChange)
  }
}

// When storage is blocked the preference still applies for this page view
const memory = new Map<string, string>()

function read(key: string) {
  if (memory.has(key)) return memory.get(key)!
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Per-viewer preference in localStorage (column visibility, density…).
 * Server render and first client render use `fallback`, so hydration never
 * mismatches; the stored value takes over right after. Syncs across tabs.
 * Not for anything that must persist reliably — it can be cleared any time.
 */
export function useLocalStorage<T>(key: string, fallback: T) {
  const raw = React.useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  )

  const value = React.useMemo<T>(() => {
    if (raw === null) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
    // fallback is a default; only the stored string should drive re-parsing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw])

  const setValue = React.useCallback(
    (next: T | ((old: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (old: T) => T)(value) : next
      const json = JSON.stringify(resolved)
      try {
        window.localStorage.setItem(key, json)
        memory.delete(key)
      } catch {
        memory.set(key, json) // storage blocked: keep it for this page view
      }
      window.dispatchEvent(new Event(EVENT))
    },
    [key, value]
  )

  return [value, setValue] as const
}
