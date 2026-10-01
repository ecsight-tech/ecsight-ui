"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "cn"

import { iconSwap } from "@/lib/motion"

type SolarIcon = React.ComponentType<React.ComponentProps<"svg"> & { alt?: string }>

type IconProps = Omit<React.ComponentProps<"svg">, "ref"> & {
  /** Solar icon in its resting style — import from `@solar-icons/react/linear` */
  as: SolarIcon
  /** Same glyph in its active style — import from `@solar-icons/react/bold` (or `bold-duotone`) */
  activeAs?: SolarIcon
  /** Swaps `as` → `activeAs` with a spring (selected nav item, toggled favourite, …) */
  active?: boolean
  /** Accessible name. Omit for decorative icons next to visible text. */
  label?: string
}

/**
 * The only way to render an icon whose style depends on state.
 * Static icons can be imported from `@solar-icons/react/linear` directly.
 *
 * @example
 * import { HomeIcon } from "@solar-icons/react/linear"
 * import { HomeIcon as HomeBold } from "@solar-icons/react/bold"
 * <Icon as={HomeIcon} activeAs={HomeBold} active={isCurrent} />
 */
function Icon({ as: Rest, activeAs: Active, active = false, label, className, ...props }: IconProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const }

  if (!Active) {
    return <Rest data-slot="icon" className={className} {...a11y} {...props} />
  }

  const Current = active ? Active : Rest
  return (
    <span
      data-slot="icon"
      data-active={active || undefined}
      className="inline-grid shrink-0 place-items-center *:col-start-1 *:row-start-1"
      {...a11y}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={active ? "active" : "rest"}
          variants={iconSwap}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="inline-flex"
        >
          <Current className={cn("size-4", className)} aria-hidden {...props} />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { Icon, type SolarIcon }
