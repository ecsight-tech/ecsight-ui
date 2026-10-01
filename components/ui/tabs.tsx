"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

import { spring } from "@/lib/motion"

/** Tracks the active value so the indicator can glide between triggers (works controlled or uncontrolled). */
const TabsContext = React.createContext<{ value?: string; layoutId: string }>({ layoutId: "tabs" })
const TabsListContext = React.createContext<"default" | "line">("default")

function Tabs({
  className,
  orientation = "horizontal",
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const id = React.useId()

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      value={value}
      onValueChange={(v) => {
        setInner(v)
        onValueChange?.(v)
      }}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      {...props}
    >
      <TabsContext.Provider value={{ value, layoutId: `tabs-indicator-${id}` }}>{children}</TabsContext.Provider>
    </TabsPrimitive.Root>
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-(--control-h) group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListContext.Provider value={variant ?? "default"}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

function TabsTrigger({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value, layoutId } = React.useContext(TabsContext)
  const variant = React.useContext(TabsListContext)
  const active = value === props.value

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative isolate inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors duration-(--motion-base) group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-active:text-foreground dark:text-muted-foreground dark:hover:text-foreground dark:data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={spring.snappy}
          aria-hidden
          className={cn(
            "absolute -z-10",
            variant === "line"
              ? "inset-x-0 -bottom-[5px] h-0.5 rounded-full bg-foreground group-data-vertical/tabs:inset-x-auto group-data-vertical/tabs:inset-y-0 group-data-vertical/tabs:-right-1 group-data-vertical/tabs:h-auto group-data-vertical/tabs:w-0.5"
              : "inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
          )}
        />
      )}
      {children}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 text-sm outline-none", className)} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
