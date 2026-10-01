"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircleIcon, CloseIcon, DangerTriangleIcon, InfoCircleIcon, CloseCircleIcon } from "@solar-icons/react/linear"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/** Icon disc tinted by toast type (sonner sets data-type on the toast) */
const iconTone = cn(
  "relative grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-[18px]",
  "group-data-[type=success]/toast:bg-success/10 group-data-[type=success]/toast:text-success",
  "group-data-[type=error]/toast:bg-destructive/10 group-data-[type=error]/toast:text-destructive",
  "group-data-[type=warning]/toast:bg-warning/15 group-data-[type=warning]/toast:text-warning-foreground",
  "group-data-[type=info]/toast:bg-primary/10 group-data-[type=info]/toast:text-primary"
)

/**
 * Sonner, fully styled with Ecsight tokens (`unstyled` drops sonner's own look but keeps
 * its stacking, swipe and enter/exit motion). Layout: tinted icon disc · title + description ·
 * optional action; ✕ appears on hover. Usage stays `toast.success("บันทึกแล้ว", { description })`.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      gap={10}
      closeButton
      icons={{
        success: <CheckCircleIcon />,
        info: <InfoCircleIcon />,
        warning: <DangerTriangleIcon />,
        error: <CloseCircleIcon />,
        loading: <Spinner />,
        close: <CloseIcon className="size-3" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "group/toast pointer-events-auto flex w-(--width) items-start gap-3 rounded-xl border bg-popover p-3 pr-3.5",
            "text-popover-foreground shadow-lg shadow-black/5 dark:shadow-black/30"
          ),
          icon: iconTone,
          content: "grid min-w-0 flex-1 gap-0.5 pt-[5px]",
          title: "text-sm leading-snug font-medium",
          description: "text-[13px] leading-snug text-muted-foreground",
          actionButton: cn(buttonVariants({ size: "sm" }), "shrink-0 self-center"),
          cancelButton: cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0 self-center"),
          closeButton: cn(
            "absolute -top-2 -left-2 grid size-5 place-items-center rounded-full border bg-popover text-muted-foreground shadow-xs",
            "opacity-0 transition-opacity duration-(--motion-fast) group-hover/toast:opacity-100 focus-visible:opacity-100 hover:text-foreground"
          ),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
