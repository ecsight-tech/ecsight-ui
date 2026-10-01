"use client"

import * as React from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import {
  BellIcon,
  BoxIcon,
  CartLarge2Icon,
  Chart2Icon,
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

const secondaryNav: NavItem[] = [
  { key: "settings", label: "ตั้งค่า", icon: SettingsIcon, activeIcon: SettingsBold },
]

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
                <div className="grid flex-1 text-left leading-tight">
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
                <div className="grid flex-1 text-left text-sm leading-tight">
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
        <TopBar breadcrumb={breadcrumb} />
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

function TopBar({ breadcrumb }: { breadcrumb: string[] }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

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
          <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-mono text-[0.7rem] sm:inline">⌘K</kbd>
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
            <DropdownMenuItem variant="destructive">
              <Logout2Icon /> ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="พิมพ์เพื่อค้นหาคำสั่งหรือหน้า…" />
        <CommandList>
          <CommandEmpty>ไม่พบผลลัพธ์</CommandEmpty>
          <CommandGroup heading="ไปที่หน้า">
            {defaultNav.map((item) => (
              <CommandItem key={item.key} onSelect={() => setOpen(false)}>
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="การตั้งค่า">
            <CommandItem onSelect={() => setOpen(false)}>
              <SettingsIcon />
              ตั้งค่าระบบ
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
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
            <Button variant="ghost" size="icon" className="relative" aria-label={`การแจ้งเตือน ยังไม่อ่าน ${unread.length}`}>
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

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // false during SSR/hydration, true after — avoids a theme-dependent hydration mismatch
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
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
