"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { cn } from "cn"

import { spring } from "@/lib/motion"
import { ThemeToggle } from "@/components/blocks/app-shell"
import { LogoMark } from "@/components/ui/logo"

const links = [
  { href: "/", label: "Overview" },
  { href: "/components/button", label: "Components", match: "/components" },
  { href: "/blocks/app-shell", label: "Blocks", match: "/blocks" },
  { href: "/demo", label: "Demo" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" aria-label="Ecsight DS หน้าแรก" className="flex shrink-0 items-center gap-2 font-semibold">
          <LogoMark className="size-6" />
          <span className="hidden sm:inline">Ecsight DS</span>
        </Link>
        <nav className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1 text-sm [scrollbar-width:none]">
          {links.map((l) => {
            const active = l.match ? pathname.startsWith(l.match) : pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative isolate shrink-0 rounded-md px-2.5 py-1.5 transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="site-nav-active"
                    transition={spring.snappy}
                    className="absolute inset-0 -z-10 rounded-md bg-muted"
                  />
                )}
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
