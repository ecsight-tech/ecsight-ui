import { cn } from "cn"

/** One key: `<Kbd>⌘</Kbd>`. Use in tooltips, menus (`DropdownMenuShortcut`) and help text. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-[5px] border border-b-2 bg-muted px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none",
        "in-data-[slot=tooltip-content]:border-background/20 in-data-[slot=tooltip-content]:bg-background/15 in-data-[slot=tooltip-content]:text-background",
        className
      )}
      {...props}
    />
  )
}

/** A chord or sequence: `<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>`; pass `then` for sequences like g → o */
function KbdGroup({ className, children, then, ...props }: React.ComponentProps<"span"> & { then?: boolean }) {
  const keys = Array.isArray(children) ? children : [children]
  return (
    <span data-slot="kbd-group" className={cn("inline-flex items-center gap-0.5", className)} {...props}>
      {then
        ? keys.map((k, i) => (
            <span key={i} className="inline-flex items-center gap-0.5">
              {i > 0 && <span className="px-0.5 text-[0.7rem] text-muted-foreground">แล้ว</span>}
              {k}
            </span>
          ))
        : children}
    </span>
  )
}

export { Kbd, KbdGroup }
