import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { components } from "@/lib/catalog"
import { installCommand } from "@/lib/site"
import { readRegion, readSource } from "@/lib/source"
import { ExamplePreview } from "@/components/gallery/example-preview"
import { CodeBlock } from "@/components/gallery/code-block"
import { PreviewTabs } from "@/components/gallery/preview-tabs"
import { Badge } from "@/components/ui/badge"

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<"/docs/components/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const item = components.find((c) => c.slug === slug)
  return { title: item?.title }
}

export default async function ComponentPage({ params }: PageProps<"/docs/components/[slug]">) {
  const { slug } = await params
  const item = components.find((c) => c.slug === slug)
  if (!item) notFound()

  const example = await readRegion("components/examples/index.tsx", slug)
  const sources = await Promise.all(item.files.map(async (f) => ({ file: f, code: await readSource(f) })))

  return (
    <article className="grid gap-10">
      <header className="grid gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          {item.custom && <Badge variant="secondary">Ecsight</Badge>}
        </div>
        <p className="text-muted-foreground">{item.description}</p>
        {item.motion && (
          <p className="w-fit rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground">
            <span className="font-medium">Motion:</span> {item.motion}
          </p>
        )}
      </header>

      <PreviewTabs
        preview={<ExamplePreview slug={slug} />}
        code={example ? <CodeBlock code={example} /> : <p className="text-sm text-muted-foreground">No example.</p>}
      />

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">ติดตั้ง</h2>
        <CodeBlock lang="bash" code={installCommand(slug)} />
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Source</h2>
        {sources.map((s) => (
          <CodeBlock key={s.file} title={s.file} code={s.code} />
        ))}
      </section>
    </article>
  )
}
