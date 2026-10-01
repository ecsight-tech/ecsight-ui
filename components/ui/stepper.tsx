"use client"

import { motion } from "motion/react"
import { CheckIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { spring } from "@/lib/motion"

export type Step = { title: string; description?: string }

/**
 * Progress through a multi-step flow (onboarding, import, checkout).
 * `current` is the 0-based active step; earlier steps show a check. Pass
 * `onStepClick` to let people jump back to completed steps only.
 * The connector fills on a spring as steps complete.
 */
function Stepper({
  steps,
  current,
  onStepClick,
  orientation = "horizontal",
  className,
}: {
  steps: Step[]
  current: number
  onStepClick?: (index: number) => void
  orientation?: "horizontal" | "vertical"
  className?: string
}) {
  const vertical = orientation === "vertical"
  const list = (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      className={cn("flex", vertical ? "flex-col" : "items-start", className)}
    >
      {steps.map((step, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming"
        const clickable = !!onStepClick && i < current
        const Marker = clickable ? "button" : "span"
        return (
          <li
            key={step.title}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("relative flex", vertical ? "gap-3 pb-6 last:pb-0" : "flex-1 flex-col items-center text-center last:flex-none sm:last:flex-1")}
          >
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute overflow-hidden rounded-full bg-border",
                  vertical ? "top-9 bottom-1 left-[15px] w-0.5" : "top-[15px] right-[calc(-50%+20px)] left-[calc(50%+20px)] h-0.5"
                )}
              >
                <motion.span
                  className={cn("absolute inset-0 origin-left bg-primary", vertical && "origin-top")}
                  initial={false}
                  animate={vertical ? { scaleY: i < current ? 1 : 0 } : { scaleX: i < current ? 1 : 0 }}
                  transition={spring.gentle}
                />
              </span>
            )}
            <Marker
              {...(clickable && { type: "button" as const, onClick: () => onStepClick?.(i) })}
              aria-label={clickable ? `กลับไปขั้นที่ ${i + 1}: ${step.title}` : undefined}
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-sm font-medium tabular-nums transition-colors",
                state === "complete" && "border-primary bg-primary text-primary-foreground",
                state === "current" && "border-primary bg-background text-primary ring-4 ring-primary/15",
                state === "upcoming" && "bg-background text-muted-foreground",
                clickable && "cursor-pointer hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              )}
            >
              {state === "complete" ? (
                <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.bouncy}>
                  <CheckIcon className="size-4" />
                </motion.span>
              ) : (
                i + 1
              )}
            </Marker>
            <div className={cn("grid gap-0.5", vertical ? "pt-1" : "mt-2 hidden px-2 sm:grid")}>
              <span className={cn("text-sm font-medium", state === "upcoming" && "text-muted-foreground")}>{step.title}</span>
              {step.description && <span className="text-xs text-muted-foreground">{step.description}</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
  if (vertical) return list
  return (
    <div className="grid gap-2">
      {list}
      {/* titles are hidden under sm — say where we are instead */}
      <p className="text-center text-sm sm:hidden">
        <span className="text-muted-foreground tabular-nums">
          ขั้นที่ {Math.min(current + 1, steps.length)}/{steps.length} ·{" "}
        </span>
        <span className="font-medium">{steps[Math.min(current, steps.length - 1)]?.title}</span>
      </p>
    </div>
  )
}

export { Stepper }
