"use client"

import * as React from "react"
import { cn } from "cn"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** Preview / Code switcher used on every component and block page. */
export function PreviewTabs({
  preview,
  code,
  previewClassName,
}: {
  preview: React.ReactNode
  code: React.ReactNode
  previewClassName?: string
}) {
  return (
    <Tabs defaultValue="preview" className="gap-3">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div
          className={cn(
            "flex min-h-72 items-center justify-center rounded-xl border bg-background p-6 sm:p-10",
            "bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]",
            previewClassName
          )}
        >
          {preview}
        </div>
      </TabsContent>
      <TabsContent value="code">{code}</TabsContent>
    </Tabs>
  )
}
