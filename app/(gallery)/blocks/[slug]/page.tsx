import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { blocks } from "@/lib/catalog"
import { installCommand } from "@/lib/site"
import { readSource } from "@/lib/source"
import { BlockPreview } from "@/components/gallery/block-previews"
import { CodeBlock } from "@/components/gallery/code-block"
import { PreviewTabs } from "@/components/gallery/preview-tabs"

export function generateStaticParams() {
  return blocks.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps<"/blocks/[slug]">): Promise<Metadata> {
  const { slug } = await params
  return { title: blocks.find((b) => b.slug === slug)?.title }
}

export default async function BlockPage({ params }: PageProps<"/blocks/[slug]">) {
  const { slug } = await params
  const item = blocks.find((b) => b.slug === slug)
  if (!item) notFound()

  const sources = await Promise.all(item.files.map(async (f) => ({ file: f, code: await readSource(f) })))

  return (
    <article className="grid gap-10">
      <header className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
        <p className="text-muted-foreground">{item.description}</p>
        {item.motion && (
          <p className="w-fit rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground">
            <span className="font-medium">Motion:</span> {item.motion}
          </p>
        )}
      </header>

      <PreviewTabs
        previewClassName={slug === "app-shell" ? "p-2 sm:p-2" : undefined}
        preview={<BlockPreview slug={slug} />}
        code={
          <div className="grid gap-3">
            {sources.map((s) => (
              <CodeBlock key={s.file} title={s.file} code={s.code} />
            ))}
          </div>
        }
      />

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">ติดตั้ง</h2>
        <CodeBlock lang="bash" code={installCommand(slug)} />
      </section>
    </article>
  )
}
