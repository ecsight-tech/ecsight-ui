import type { Transition, Variants } from "motion/react"

/**
 * Ecsight motion tokens. Mirrors the CSS tokens in app/globals.css
 * (--motion-*, --ease-*). Personality: snappy spring, slight overshoot,
 * 120–320ms. Never animate for decoration alone — motion must explain a
 * state change, a spatial relationship, or confirm an action.
 */
export const duration = {
  fast: 0.12,
  base: 0.18,
  slow: 0.26,
} as const

export const ease = {
  out: [0.22, 1, 0.36, 1],
  in: [0.4, 0, 1, 1],
} as const

export const spring = {
  /** Default for anything interactive: press, toggle, pop-in, layout shifts */
  snappy: { type: "spring", stiffness: 500, damping: 32, mass: 1 },
  /** Larger surfaces and layout changes that move far */
  gentle: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
  /** Icon swaps, checkmarks, tiny badges — a touch more bounce */
  bouncy: { type: "spring", stiffness: 600, damping: 22, mass: 0.8 },
} as const satisfies Record<string, Transition>

/* ─── Presets ─────────────────────────────────────────────────────────── */

/** Spread onto a motion element for tactile press feedback */
export const pressable = {
  whileTap: { scale: 0.97 },
  transition: spring.snappy,
} as const

/** Popovers, menus, tooltips rendered with Motion (Radix overlays use CSS) */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast, ease: ease.in } },
}

/** Fade + rise for content appearing in place (cards, sections, rows) */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: spring.gentle },
  exit: { opacity: 0, y: -4, transition: { duration: duration.fast, ease: ease.in } },
}

/** Parent of a staggered list — pair children with `fadeUp` */
export const listStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
}

/** Linear → Bold icon swap (see components/ui/icon.tsx) */
export const iconSwap: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: spring.bouncy },
  exit: { opacity: 0, scale: 0.6, transition: { duration: duration.fast, ease: ease.in } },
}
