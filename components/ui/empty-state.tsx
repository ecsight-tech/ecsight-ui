"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "cn"

import { fadeUp, listStagger } from "@/lib/motion"
import type { SolarIcon } from "@/components/ui/icon"

type EmptyStateProps = Omit<React.ComponentProps<typeof motion.div>, "title"> & {
  /** Use a `bold-duotone` Solar icon — empty states are the one place for duotone */
  icon?: SolarIcon
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary next step, usually a <Button> */
  action?: React.ReactNode
}

/** Shown when a list, table or search has nothing to display. Always offer a next step. */
function EmptyState({ icon: IconCmp, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <motion.div
      data-slot="empty-state"
      variants={listStagger}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}
      {...props}
    >
      {IconCmp && (
        <motion.div
          variants={fadeUp}
          className="mb-1 grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground"
        >
          <IconCmp className="size-6" aria-hidden />
        </motion.div>
      )}
      <motion.h3 variants={fadeUp} className="text-base font-semibold text-foreground">
        {title}
      </motion.h3>
      {description && (
        <motion.p variants={fadeUp} className="max-w-sm text-sm text-muted-foreground">
          {description}
        </motion.p>
      )}
      {action && (
        <motion.div variants={fadeUp} className="mt-2">
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export { EmptyState }
