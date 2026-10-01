"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { ThemeToggle } from "@/components/blocks/app-shell"
import { Button } from "@/components/ui/button"
import { LogoMark } from "@/components/ui/logo"

const links = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/docs/blocks/app-shell", label: "Blocks" },
  { href: "/demo", label: "Demo" },
  { href: "/design.md", label: "design.md" },
]

/** shadcn-style top bar: logo + flat text nav on the left, theme toggle and CTA on the right. */
export function LandingHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" aria-label="Ecsight UI home" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <LogoMark className="size-6" />
          <span className="sm:hidden lg:inline">Ecsight UI</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-0.5 text-sm sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={cn(
                "rounded-md px-2.5 py-1.5 font-medium transition-colors hover:text-foreground",
                pathname === l.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/docs">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
