"use client"

import * as React from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"
import {
  BellIcon,
  BoxIcon,
  CartLarge2Icon,
  Chart2Icon,
  KeyboardIcon,
  Logout2Icon,
  MagnifierIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserRoundedIcon,
  UsersGroupRoundedIcon,
  Widget5Icon,
} from "@solar-icons/react/linear"
import {
  BellIcon as BellBold,
  BoxIcon as BoxBold,
  CartLarge2Icon as CartLarge2Bold,
  Chart2Icon as Chart2Bold,
  SettingsIcon as SettingsBold,
  UsersGroupRoundedIcon as UsersGroupRoundedBold,
  Widget5Icon as Widget5Bold,
} from "@solar-icons/react/bold"

import { useDensity, type Density } from "@/hooks/use-density"
import { spring } from "@/lib/motion"
import { Icon, type SolarIcon } from "@/components/ui/icon"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CountBadge } from "@/components/ui/count-badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LogoMark } from "@/components/ui/logo"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export type NavItem = {
  key: string
  label: string
  icon: SolarIcon
  activeIcon: SolarIcon
  badge?: string
}

export const defaultNav: NavItem[] = [
  { key: "overview", label: "ภาพรวม", icon: Widget5Icon, activeIcon: Widget5Bold },
  { key: "orders", label: "คำสั่งซื้อ", icon: CartLarge2Icon, activeIcon: CartLarge2Bold, badge: "12" },
  { key: "customers", label: "ลูกค้า", icon: UsersGroupRoundedIcon, activeIcon: UsersGroupRoundedBold },
  { key: "products", label: "สินค้า", icon: BoxIcon, activeIcon: BoxBold },
  { key: "reports", label: "รายงาน", icon: Chart2Icon, activeIcon: Chart2Bold },
]

const secondaryNav: NavItem[] = [{ key: "settings", label: "ตั้งค่า", icon: SettingsIcon, activeIcon: SettingsBold }]

/** "G then <key>" jumps to a page — Linear/GitHub style. Keys are nav item keys. */
const goKeys: Record<string, string> = {
  overview: "d",
  orders: "o",
  customers: "c",
  products: "p",
  reports: "r",
  settings: "s",
}

/**
 * App-wide shortcuts. Off while typing in a field (except ⌘K):
 * ⌘K palette · / focus the page's search (`data-shortcut="search"`) · G→X go to page · ? help.
 */
function useAppShortcuts({
  onNavigate,
  togglePalette,
  openHelp,
}: {
  onNavigate: (key: string) => void
  togglePalette: () => void
  openHelp: () => void
}) {
  useHotkeys("mod+k", togglePalette, { preventDefault: true, enableOnFormTags: true }, [togglePalette])
  useHotkeys(
    "slash",
    () => {
      const search = document.querySelector<HTMLElement>("[data-shortcut=search]")
      if (search) search.focus()
      else togglePalette()
    },
    { preventDefault: true },
    [togglePalette],
  )
  // "G then X": the library's `g>o` sequences share one buffer per hook and reset each
  // other, so track G ourselves. Physical keys (event.code) → also works on the Thai layout.
  const gPressedAt = React.useRef(0)
  useHotkeys("g", () => (gPressedAt.current = Date.now()))
  useHotkeys(
    Object.values(goKeys).join(","),
    (_, handler) => {
      if (Date.now() - gPressedAt.current > 1000) return
      gPressedAt.current = 0
      const page = Object.keys(goKeys).find((p) => goKeys[p] === handler.hotkey)
      if (page) onNavigate(page)
    },
    [onNavigate]
  )
  useHotkeys("shift+slash", openHelp, [openHelp])
}

/** Every shortcut in one place — opened with ? */
function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pages = [...defaultNav, ...secondaryNav].filter((i) => goKeys[i.key])
  const row = (label: string, keys: React.ReactNode) => (
    <div key={label} className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span>{label}</span>
      {keys}
    </div>
  )
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>คีย์ลัด</DialogTitle>
          <DialogDescription>ใช้ได้ทุกหน้า ยกเว้นตอนพิมพ์ในช่องกรอกข้อมูล</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <section>
            <h3 className="mb-1 text-xs font-medium text-muted-foreground">ทั่วไป</h3>
            {row(
              "ค้นหาคำสั่งหรือหน้า",
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>,
            )}
            {row("ค้นหาในหน้านี้", <Kbd>/</Kbd>)}
            {row(
              "ย่อ/ขยายเมนูข้าง",
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>,
            )}
            {row("ล้างรายการที่เลือกในตาราง", <Kbd>Esc</Kbd>)}
            {row("แสดงคีย์ลัด", <Kbd>?</Kbd>)}
          </section>
          <section>
            <h3 className="mb-1 text-xs font-medium text-muted-foreground">ไปที่หน้า</h3>
            {pages.map((p) =>
              row(
                p.label,
                <KbdGroup then>
                  <Kbd>G</Kbd>
                  <Kbd>{goKeys[p.key].toUpperCase()}</Kbd>
                </KbdGroup>,
              ),
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Block: the standard Ecsight app frame — collapsible sidebar with animated
 * active indicator + Linear→Bold icon swap, top bar with breadcrumb, ⌘K
 * search, theme toggle, notifications and account menu.
 */
export function AppShell({
  children,
  breadcrumb = ["Ecsight", "ภาพรวม"],
  nav = defaultNav,
  active: activeProp,
  onNavigate,
}: {
  children: React.ReactNode
  breadcrumb?: string[]
  nav?: NavItem[]
  active?: string
  onNavigate?: (key: string) => void
}) {
  const [activeState, setActiveState] = React.useState(nav[0]?.key)
  const active = activeProp ?? activeState
  const navigate = (key: string) => {
    setActiveState(key)
    onNavigate?.(key)
  }
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  useAppShortcuts({
    onNavigate: navigate,
    togglePalette: () => setPaletteOpen((o) => !o),
    openHelp: () => setHelpOpen(true),
  })

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <div className="grid size-8 shrink-0 place-items-center">
                  <LogoMark className="size-6" />
                </div>
                <div className="grid flex-1 text-left leading-snug">
                  <span className="truncate text-sm font-semibold">Ecsight</span>
                  <span className="truncate text-xs text-muted-foreground">Workspace</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavGroup label="เมนูหลัก" items={nav} active={active} onSelect={navigate} />
          <NavGroup label="ระบบ" items={secondaryNav} active={active} onSelect={navigate} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="บัญชี">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">ปท</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-snug">
                  <span className="truncate font-medium">ปิยะ ทีมงาน</span>
                  <span className="truncate text-xs text-muted-foreground">piya@ecsight.example</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <TopBar
          breadcrumb={breadcrumb}
          paletteOpen={paletteOpen}
          setPaletteOpen={setPaletteOpen}
          onNavigate={navigate}
          onShowShortcuts={() => setHelpOpen(true)}
        />
        <ShortcutsDialog open={helpOpen} onOpenChange={setHelpOpen} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function NavGroup({
  label,
  items,
  active,
  onSelect,
}: {
  label: string
  items: NavItem[]
  active?: string
  onSelect: (key: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.key === active
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  onClick={() => onSelect(item.key)}
                  className="relative isolate data-[active=true]:bg-transparent"
                >
                  {isActive && (
                    <motion.span
                      layoutId="app-shell-nav-active"
                      transition={spring.snappy}
                      className="absolute inset-0 -z-10 rounded-md bg-sidebar-accent shadow-xs ring-1 ring-sidebar-border"
                    />
                  )}
                  <Icon
                    as={item.icon}
                    activeAs={item.activeIcon}
                    active={isActive}
                    className={isActive ? "text-primary" : undefined}
                  />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function TopBar({
  breadcrumb,
  paletteOpen: open,
  setPaletteOpen: setOpen,
  onNavigate,
  onShowShortcuts,
}: {
  breadcrumb: string[]
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
  onNavigate: (key: string) => void
  onShowShortcuts: () => void
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-vertical:h-4 data-vertical:self-center" />
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {i === breadcrumb.length - 1 ? (
                  <BreadcrumbPage>{crumb}</BreadcrumbPage>
                ) : (
                  <span className="text-muted-foreground">{crumb}</span>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          className="w-9 justify-start px-0 text-muted-foreground sm:w-56 sm:px-3"
          onClick={() => setOpen(true)}
          aria-label="ค้นหา"
        >
          <MagnifierIcon className="mx-auto sm:mx-0" />
          <span className="hidden sm:inline">ค้นหา…</span>
          <KbdGroup className="ml-auto hidden sm:inline-flex">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <ThemeToggle />
        <Notifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="เมนูบัญชี">
              <Avatar className="size-8">
                <AvatarFallback>ปท</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRoundedIcon /> โปรไฟล์
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon /> ตั้งค่า
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DensityMenu />
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Logout2Icon /> ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* shadcn v4 CommandDialog does not wrap children in <Command> — without it cmdk crashes */}
        <Command>
          <CommandInput placeholder="พิมพ์เพื่อค้นหาคำสั่งหรือหน้า…" />
          <CommandList>
            <CommandEmpty>ไม่พบผลลัพธ์</CommandEmpty>
            <CommandGroup heading="ไปที่หน้า">
              {[...defaultNav, ...secondaryNav].map((item) => (
                <CommandItem
                  key={item.key}
                  onSelect={() => {
                    setOpen(false)
                    onNavigate(item.key)
                  }}
                >
                  <item.icon />
                  {item.label}
                  {goKeys[item.key] && (
                    <CommandShortcut>
                      <KbdGroup then>
                        <Kbd>G</Kbd>
                        <Kbd>{goKeys[item.key].toUpperCase()}</Kbd>
                      </KbdGroup>
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="ความช่วยเหลือ">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  onShowShortcuts()
                }}
              >
                <KeyboardIcon />
                คีย์ลัดทั้งหมด
                <CommandShortcut>
                  <Kbd>?</Kbd>
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </header>
  )
}

const initialNotifications = [
  { id: 1, title: "คำสั่งซื้อใหม่ ORD-24305", time: "2 นาทีที่แล้ว" },
  { id: 2, title: "ลูกค้าขอคืนเงิน ORD-24109", time: "1 ชม. ที่แล้ว" },
  { id: 3, title: "สต็อก “กาแฟคั่วกลาง” ใกล้หมด", time: "3 ชม. ที่แล้ว" },
]

function Notifications() {
  const [unread, setUnread] = React.useState(initialNotifications)

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`การแจ้งเตือน ยังไม่อ่าน ${unread.length}`}
            >
              <Icon as={BellIcon} activeAs={BellBold} active={unread.length > 0} />
              <CountBadge count={unread.length} className="absolute -top-0.5 -right-0.5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>การแจ้งเตือน</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center justify-between">
          การแจ้งเตือน
          {unread.length > 0 && (
            <button
              type="button"
              className="text-xs font-normal text-primary hover:underline"
              onClick={() => setUnread([])}
            >
              อ่านทั้งหมด
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {unread.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">ไม่มีการแจ้งเตือนใหม่</p>
        ) : (
          unread.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="items-start"
              onSelect={(e) => {
                e.preventDefault()
                setUnread((list) => list.filter((x) => x.id !== n.id))
              }}
            >
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              <span className="grid gap-0.5">
                <span>{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Account-menu section: comfortable (36px controls) vs compact (32px, tighter table rows) */
function DensityMenu() {
  const [density, setDensity] = useDensity()
  return (
    <>
      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">ความหนาแน่น</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as Density)}>
        <DropdownMenuRadioItem value="comfortable" onSelect={(e) => e.preventDefault()}>
          สบายตา
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="compact" onSelect={(e) => e.preventDefault()}>
          กระชับ
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // false during SSR/hydration, true after — avoids a theme-dependent hydration mismatch
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const dark = mounted && resolvedTheme === "dark"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={dark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
          onClick={() => setTheme(dark ? "light" : "dark")}
        >
          <Icon as={SunIcon} activeAs={MoonIcon} active={dark} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{dark ? "โหมดสว่าง" : "โหมดมืด"}</TooltipContent>
    </Tooltip>
  )
}
