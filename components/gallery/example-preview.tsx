"use client"

import { examples } from "@/components/examples"

/** Client boundary so server pages can render an example by slug. */
export function ExamplePreview({ slug }: { slug: string }) {
  const Example = examples[slug]
  return Example ? <Example /> : null
}
