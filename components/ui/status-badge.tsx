import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const statusBadgeVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "bg-success/10 text-success",
        warning: "bg-warning/15 text-foreground [--dot:var(--warning)]",
        info: "bg-primary/10 text-primary",
        danger: "bg-destructive/10 text-destructive",
        neutral: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

export type StatusTone = NonNullable<VariantProps<typeof statusBadgeVariants>["tone"]>

/**
 * Status of a record: dot + label on a tinted pill. The dot keeps status
 * readable without relying on colour alone in dense tables. `live` pulses the
 * dot — only for states that are actively changing (กำลังจัดส่ง, กำลังประมวลผล).
 * Map domain states to tones once, next to the data (e.g. `orderStatusTone`).
 */
function StatusBadge({
  tone,
  live = false,
  dot = true,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusBadgeVariants> & { live?: boolean; dot?: boolean }) {
  return (
    <span data-slot="status-badge" data-tone={tone} className={cn(statusBadgeVariants({ tone }), className)} {...props}>
      {dot && (
        <span aria-hidden className="relative flex size-1.5">
          {live && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-(--dot,currentColor) opacity-60 motion-reduce:hidden" />
          )}
          <span className="relative inline-flex size-1.5 rounded-full bg-(--dot,currentColor)" />
        </span>
      )}
      {children}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
