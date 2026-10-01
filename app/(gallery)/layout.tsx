import { DocsNav } from "@/components/gallery/docs-nav"
import { SiteHeader } from "@/components/gallery/site-header"

export default function GalleryLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 md:grid-cols-[13rem_1fr] md:px-6">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto py-8 pr-2 md:block">
          <DocsNav />
        </aside>
        <main className="min-w-0 py-8 md:py-10">{children}</main>
      </div>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Ecsight Design System · built on shadcn/ui · icons by{" "}
        <a href="https://www.figma.com/community/file/1166831539721848736" className="underline underline-offset-4">
          480 Design (Solar, CC BY 4.0)
        </a>
      </footer>
    </div>
  )
}
