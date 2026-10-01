"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { cn } from "cn"

import { spring } from "@/lib/motion"
import { blocks, components } from "@/lib/catalog"

const sections = [
  { title: "Components", base: "/docs/components", items: components },
  { title: "Blocks", base: "/docs/blocks", items: blocks },
]

export function DocsNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Components" className="grid gap-6 text-sm">
      {sections.map((s) => (
        <div key={s.title} className="grid gap-1">
          <p className="px-2.5 pb-1 text-xs font-medium text-muted-foreground">{s.title}</p>
          {s.items.map((item) => {
            const href = `${s.base}/${item.slug}`
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative isolate flex items-center justify-between rounded-md px-2.5 py-1.5 transition-colors",
                  active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="docs-nav-active"
                    transition={spring.snappy}
                    className="absolute inset-0 -z-10 rounded-md bg-muted"
                  />
                )}
                {item.title}
                {item.custom && (
                  <span className="rounded bg-accent px-1.5 text-[0.65rem] text-accent-foreground">Ecsight</span>
                )}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
