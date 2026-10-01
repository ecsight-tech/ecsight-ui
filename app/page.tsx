import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "@solar-icons/react/linear"

import { LandingHeader } from "@/components/landing/landing-header"
import { Showcase } from "@/components/landing/showcase"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: { absolute: "Ecsight UI · The design system your agent builds with" },
  description:
    "Agent-first components for Ecsight web apps: shadcn/ui with snappy motion, Solar icons and Thai-ready type, installed as source from one registry.",
}

export default function LandingPage() {
  return (
    <div lang="en" className="flex min-h-svh flex-col">
      <LandingHeader />

      <main className="flex-1">
        <section className="mx-auto grid max-w-3xl justify-items-center gap-4 px-4 pt-16 pb-12 text-center md:pt-24 md:pb-16">
          <Link
            href="/docs/blocks/orders-table"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            New data table toolbar and density
            <ArrowRightIcon className="size-3.5" />
          </Link>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            The design system your agent builds with
          </h1>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            Accessible components with snappy motion, Solar icons and Thai-ready type. Paste one prompt and your agent
            builds Ecsight pages from code you own.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button asChild>
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/docs/components/button">View Components</Link>
            </Button>
          </div>
        </section>

        <section aria-label="Component examples" className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <Showcase />
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-balance text-muted-foreground">
        Built for Ecsight on{" "}
        <a href="https://ui.shadcn.com" className="font-medium underline underline-offset-4 hover:text-foreground">
          shadcn/ui
        </a>
        . Icons by{" "}
        <a
          href="https://www.figma.com/community/file/1166831539721848736"
          className="font-medium underline underline-offset-4 hover:text-foreground"
        >
          480 Design
        </a>{" "}
        (Solar, CC BY 4.0). Rules for agents live in{" "}
        <a href="/design.md" className="font-medium underline underline-offset-4 hover:text-foreground">
          design.md
        </a>
        .
      </footer>
    </div>
  )
}
