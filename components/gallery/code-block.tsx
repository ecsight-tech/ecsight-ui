import { codeToHtml } from "shiki"
import { cn } from "cn"

import { CopyButton } from "@/components/gallery/copy-button"

/** Server-rendered, dual-theme syntax highlighting (colours switch with .dark via CSS vars). */
export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  className,
}: {
  code: string
  lang?: string
  title?: string
  className?: string
}) {
  const html = await codeToHtml(code, {
    lang,
    // high-contrast light theme: github-light's orange/red/green tokens fall below 4.5:1 on our muted bg
    themes: { light: "github-light-high-contrast", dark: "github-dark-dimmed" },
    defaultColor: false,
  })

  return (
    <div className={cn("group relative overflow-hidden rounded-xl border bg-muted/30", className)}>
      {title && (
        <div className="flex h-10 items-center border-b px-4 font-mono text-xs text-muted-foreground">{title}</div>
      )}
      <CopyButton value={code} className="absolute top-1 right-2 z-10" />
      <div
        className="max-h-[32rem] overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed [&_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
