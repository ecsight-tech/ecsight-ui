"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ErrorCode, useDropzone, type Accept, type FileRejection } from "react-dropzone"
import {
  CheckCircleIcon,
  CloudUploadIcon,
  DangerCircleIcon,
  FileTextIcon,
  GalleryIcon,
  RestartIcon,
  TrashBinTrashIcon,
} from "@solar-icons/react/linear"
import { cn } from "cn"

import { duration, ease, spring } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

/** Upload one file; report 0–100 through `onProgress`. Throw to mark it failed. */
export type UploadFn = (file: File, onProgress: (percent: number) => void) => Promise<void>

type Item = { id: string; file: File; status: "uploading" | "done" | "error"; progress: number; error?: string }

const nf = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 })
const formatBytes = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${nf.format(b / 1024)} KB` : `${nf.format(b / 1024 ** 2)} MB`

function rejectionMessage(r: FileRejection, maxSize?: number, maxFiles?: number) {
  const code = r.errors[0]?.code
  if (code === ErrorCode.FileTooLarge) return `ใหญ่เกิน ${formatBytes(maxSize ?? 0)}`
  if (code === ErrorCode.FileInvalidType) return "ชนิดไฟล์ไม่รองรับ"
  if (code === ErrorCode.TooManyFiles) return `อัปโหลดได้ครั้งละไม่เกิน ${maxFiles} ไฟล์`
  return r.errors[0]?.message ?? "อัปโหลดไม่ได้"
}

/**
 * Drag-and-drop (or click / paste) upload with a per-file list:
 * uploading (progress) → done, or error with retry. Rejected files (type,
 * size, count) are listed with the reason instead of silently dropped.
 * States: idle · drag-over (accept = brand, reject = destructive) · disabled.
 */
function FileDropzone({
  onUpload,
  accept,
  maxSize = 10 * 1024 ** 2,
  maxFiles = 10,
  hint,
  disabled,
  className,
}: {
  onUpload: UploadFn
  /** e.g. `{ "image/*": [], "application/pdf": [".pdf"] }` */
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  /** Line under the title, e.g. "PDF หรือรูปภาพ ไม่เกิน 10 MB" */
  hint?: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  const [items, setItems] = React.useState<Item[]>([])
  const [rejected, setRejected] = React.useState<{ name: string; reason: string }[]>([])

  const patch = (id: string, change: Partial<Item>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...change } : it)))

  const upload = async (item: Item) => {
    patch(item.id, { status: "uploading", progress: 0, error: undefined })
    try {
      await onUpload(item.file, (p) => patch(item.id, { progress: Math.min(100, Math.max(0, p)) }))
      patch(item.id, { status: "done", progress: 100 })
    } catch (e) {
      patch(item.id, { status: "error", error: e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ" })
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    maxSize,
    maxFiles,
    disabled,
    onDrop: (accepted, rejections) => {
      setRejected(rejections.map((r) => ({ name: r.file.name, reason: rejectionMessage(r, maxSize, maxFiles) })))
      const next = accepted.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        status: "uploading" as const,
        progress: 0,
      }))
      setItems((list) => [...next, ...list])
      next.forEach(upload)
    },
  })

  return (
    <div data-slot="file-dropzone" className={cn("grid gap-3", className)}>
      <div
        {...getRootProps()}
        data-drag={isDragActive ? (isDragReject ? "reject" : "accept") : undefined}
        className={cn(
          "grid cursor-pointer place-items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors outline-none",
          "hover:border-muted-foreground/40 hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[drag=accept]:border-primary data-[drag=accept]:bg-primary/5",
          "data-[drag=reject]:border-destructive data-[drag=reject]:bg-destructive/5",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <motion.span
          animate={isDragActive ? { y: -4, scale: 1.08 } : { y: 0, scale: 1 }}
          transition={spring.bouncy}
          className={cn(
            "grid size-11 place-items-center rounded-full bg-muted text-muted-foreground",
            isDragActive && !isDragReject && "bg-primary/10 text-primary",
            isDragReject && "bg-destructive/10 text-destructive"
          )}
        >
          {isDragReject ? <DangerCircleIcon className="size-5" /> : <CloudUploadIcon className="size-5" />}
        </motion.span>
        <p className="text-sm font-medium">
          {isDragReject ? "ไฟล์นี้อัปโหลดไม่ได้" : isDragActive ? "ปล่อยเพื่ออัปโหลด" : (
            <>
              ลากไฟล์มาวาง หรือ <span className="text-primary underline-offset-4 hover:underline">เลือกไฟล์</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {hint ?? `ไม่เกิน ${formatBytes(maxSize)} · สูงสุด ${maxFiles} ไฟล์`}
        </p>
      </div>

      {(items.length > 0 || rejected.length > 0) && (
        <ul className="grid gap-2" aria-live="polite">
          <AnimatePresence initial={false}>
            {rejected.map((r) => (
              <motion.li
                key={`rejected-${r.name}`}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, transition: spring.snappy }}
                exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
              >
                <DangerCircleIcon className="size-4 shrink-0 text-destructive" />
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="shrink-0 text-xs text-destructive">{r.reason}</span>
              </motion.li>
            ))}
            {items.map((it) => (
              <motion.li
                key={it.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, transition: spring.snappy }}
                exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                data-status={it.status}
                className="grid gap-2 rounded-lg border px-3 py-2 text-sm data-[status=error]:border-destructive/30"
              >
                <div className="flex items-center gap-3">
                  {it.file.type.startsWith("image/") ? (
                    <GalleryIcon className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{it.file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {it.status === "uploading" ? `${Math.round(it.progress)}%` : formatBytes(it.file.size)}
                  </span>
                  {it.status === "done" && <CheckCircleIcon className="size-4 shrink-0 text-success" aria-label="อัปโหลดแล้ว" />}
                  {it.status === "error" && (
                    <Button variant="ghost" size="icon-xs" aria-label={`ลองอัปโหลด ${it.file.name} อีกครั้ง`} onClick={() => upload(it)}>
                      <RestartIcon />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`ลบ ${it.file.name}`}
                    onClick={() => setItems((list) => list.filter((x) => x.id !== it.id))}
                  >
                    <TrashBinTrashIcon />
                  </Button>
                </div>
                {it.status === "uploading" && <Progress value={it.progress} aria-label={`กำลังอัปโหลด ${it.file.name}`} />}
                {it.status === "error" && <p className="text-xs text-destructive">{it.error}</p>}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

export { FileDropzone }
