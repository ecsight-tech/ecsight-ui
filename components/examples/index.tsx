"use client"

/**
 * Gallery examples. Each `#region <slug>` is shown verbatim as the "Code"
 * tab on /components/<slug>, so keep every example self-explanatory.
 */

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  AddCircleIcon,
  AltArrowDownIcon,
  CheckIcon,
  HeartIcon,
  MagnifierIcon,
  PenIcon,
  StarIcon,
  TrashBinTrashIcon,
  UserRoundedIcon,
  SettingsIcon,
  Logout2Icon,
  InfoCircleIcon,
  DangerTriangleIcon,
  BellIcon,
  CopyIcon,
} from "@solar-icons/react/linear"
import { HeartIcon as HeartBold, StarIcon as StarBold, BellIcon as BellBold } from "@solar-icons/react/bold"
import { FolderOpenIcon } from "@solar-icons/react/bold-duotone"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { email, thaiMobile, thaiTaxId } from "@/lib/validation"
import { cn } from "cn"

import { revenueSeries } from "@/lib/demo-data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CountBadge } from "@/components/ui/count-badge"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DateInput, DatePicker, DateRangePicker, type DateRange } from "@/components/ui/date-picker"
import { EmptyState } from "@/components/ui/empty-state"
import { FormField } from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Logo, LogoMark } from "@/components/ui/logo"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// #region button
export function ButtonExample() {
  const [saving, setSaving] = React.useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <AddCircleIcon />
        สร้างใหม่
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">
        <TrashBinTrashIcon />
        ลบ
      </Button>
      <Button variant="link">Link</Button>
      <Button size="icon" variant="outline" aria-label="แก้ไข">
        <PenIcon />
      </Button>
      <Button
        loading={saving}
        onClick={() => {
          setSaving(true)
          setTimeout(() => setSaving(false), 1500)
        }}
      >
        บันทึกการเปลี่ยนแปลง
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
// #endregion

// #region accordion
export function AccordionExample() {
  return (
    <Accordion type="single" collapsible defaultValue="ship" className="w-full max-w-md">
      <AccordionItem value="ship">
        <AccordionTrigger>จัดส่งภายในกี่วัน?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          กรุงเทพฯ และปริมณฑล 1–2 วันทำการ ต่างจังหวัด 2–4 วันทำการ
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="refund">
        <AccordionTrigger>ขอคืนเงินได้อย่างไร?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          แจ้งผ่านหน้าคำสั่งซื้อภายใน 7 วันหลังได้รับสินค้า ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tax">
        <AccordionTrigger>ออกใบกำกับภาษีเต็มรูปได้ไหม?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">ได้ กรอกข้อมูลบริษัทในขั้นตอนชำระเงิน</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
// #endregion

// #region field
export function FieldExample() {
  const [error, setError] = React.useState<string>()
  return (
    <form
      noValidate
      className="grid w-full max-w-sm gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        const email = String(new FormData(e.currentTarget).get("email") ?? "")
        setError(/^\S+@\S+\.\S+$/.test(email) ? undefined : "รูปแบบอีเมลไม่ถูกต้อง")
        if (/^\S+@\S+\.\S+$/.test(email)) toast.success("บันทึกแล้ว")
      }}
    >
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="ex-field-email">อีเมล</FieldLabel>
        <Input
          id="ex-field-email"
          name="email"
          placeholder="name@company.com"
          aria-invalid={!!error}
          onChange={() => setError(undefined)}
        />
        <FieldDescription>ลองกด “บันทึก” โดยกรอกผิดรูปแบบ</FieldDescription>
        <FieldError>{error}</FieldError>
      </Field>
      <Button type="submit" className="justify-self-start">
        บันทึก
      </Button>
    </form>
  )
}
// #endregion

// #region calendar
export function CalendarExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div className="flex flex-wrap items-start gap-4">
      {/* default: พ.ศ., weeks start on Sunday */}
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border" />
      {/* ค.ศ. with month/year dropdowns */}
      <Calendar mode="single" era="ce" captionLayout="dropdown" selected={date} onSelect={setDate} className="rounded-xl border" />
    </div>
  )
}
// #endregion

// #region date-picker
export function DatePickerExample() {
  const [due, setDue] = React.useState<Date>()
  const [birthday, setBirthday] = React.useState<Date>()
  const [range, setRange] = React.useState<DateRange>()
  const today = new Date()
  return (
    <div className="grid w-full max-w-sm gap-5">
      {/* Typeable: try 1/10/69, 01102569 or 1 ต.ค. 2569 */}
      <div className="grid gap-2">
        <Label htmlFor="ex-due">วันครบกำหนด (พิมพ์ได้)</Label>
        <DateInput id="ex-due" value={due} onChange={setDue} disabledDays={{ before: today }} />
      </div>
      {/* Far-away dates: month/year dropdowns */}
      <div className="grid gap-2">
        <Label htmlFor="ex-birthday">วันเกิด</Label>
        <DatePicker
          id="ex-birthday"
          value={birthday}
          onChange={setBirthday}
          captionLayout="dropdown"
          startMonth={new Date(1940, 0)}
          endMonth={today}
          disabledDays={{ after: today }}
          className="w-full"
        />
      </div>
      {/* Range: hover previews, max 31 days, no future dates, × clears */}
      <div className="grid gap-2">
        <Label htmlFor="ex-range">ช่วงวันที่ (สูงสุด 31 วัน)</Label>
        <DateRangePicker
          id="ex-range"
          value={range}
          onChange={setRange}
          maxDays={31}
          disabledDays={{ after: today }}
          className="w-full"
        />
      </div>
    </div>
  )
}
// #endregion

// #region form
const vendorSchema = z.object({
  company: z.string().trim().min(1, "กรุณากรอกชื่อบริษัท"),
  taxId: thaiTaxId,
  email,
  mobile: thaiMobile,
  startDate: z.date({ error: "กรุณาเลือกวันเริ่มสัญญา" }),
})

export function FormExample() {
  const form = useForm<z.input<typeof vendorSchema>, unknown, z.output<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: { company: "", taxId: "", email: "", mobile: "", startDate: undefined },
  })

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (v) => {
        await new Promise((r) => setTimeout(r, 800))
        toast.success("บันทึกผู้ขายแล้ว", { description: `${v.company} · ${v.taxId}` })
        form.reset()
      })}
      className="grid w-full max-w-sm gap-5"
    >
      <FormField
        control={form.control}
        name="company"
        label="ชื่อบริษัท"
        render={({ field, control }) => <Input placeholder="บริษัท ตัวอย่าง จำกัด" {...field} {...control} />}
      />
      <FormField
        control={form.control}
        name="taxId"
        label="เลขประจำตัวผู้เสียภาษี"
        description="13 หลัก ใส่ขีดได้ เช่น 0-1055-12345-67-8"
        render={({ field, control }) => <Input inputMode="numeric" {...field} {...control} />}
      />
      <FormField
        control={form.control}
        name="email"
        label="อีเมลฝ่ายบัญชี"
        render={({ field, control }) => <Input type="email" placeholder="ap@company.com" {...field} {...control} />}
      />
      <FormField
        control={form.control}
        name="mobile"
        label="เบอร์มือถือผู้ติดต่อ"
        render={({ field, control }) => <Input type="tel" placeholder="081-234-5678" {...field} {...control} />}
      />
      <FormField
        control={form.control}
        name="startDate"
        label="วันเริ่มสัญญา"
        render={({ field, control }) => (
          <DateInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} {...control} />
        )}
      />
      <Button type="submit" loading={form.formState.isSubmitting} className="justify-self-start">
        บันทึก
      </Button>
    </form>
  )
}
// #endregion

// #region count-badge
export function CountBadgeExample() {
  const [count, setCount] = React.useState(3)
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Button variant="outline" size="icon" aria-label={`การแจ้งเตือน ${count}`}>
          <BellIcon />
        </Button>
        <CountBadge count={count} className="absolute -top-1 -right-1" />
      </div>
      <Button size="sm" variant="outline" onClick={() => setCount((c) => c + 1)}>
        +1
      </Button>
      <Button size="sm" variant="outline" onClick={() => setCount((c) => Math.max(0, c - 1))}>
        −1
      </Button>
      <Button size="sm" variant="outline" onClick={() => setCount(120)}>
        120
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setCount(0)}>
        ล้าง
      </Button>
    </div>
  )
}
// #endregion

// #region input
export function InputExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="ex-email">อีเมล</Label>
      <Input id="ex-email" type="email" placeholder="name@company.com" />
      <p className="text-xs text-muted-foreground">เราจะไม่เปิดเผยอีเมลของคุณ</p>
    </div>
  )
}
// #endregion

// #region input-group
export function InputGroupExample() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupAddon>
          <MagnifierIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="ค้นหา…" aria-label="ค้นหา" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput defaultValue="ecsight.example" aria-label="โดเมน" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="คัดลอก" onClick={() => toast("คัดลอกแล้ว")}>
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
// #endregion

// #region textarea
export function TextareaExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="ex-note">หมายเหตุ</Label>
      <Textarea id="ex-note" placeholder="พิมพ์ข้อความ… ภาษาไทยมีสระบน-ล่าง เช่น ปี่ ญ ฎ ฏ ฐ" />
    </div>
  )
}
// #endregion

// #region label
export function LabelExample() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="ex-terms" />
      <Label htmlFor="ex-terms">ยอมรับเงื่อนไขการใช้งาน</Label>
    </div>
  )
}
// #endregion

// #region select
export function SelectExample() {
  return (
    <Select defaultValue="bkk">
      <SelectTrigger className="w-56" aria-label="สาขา">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>สาขา</SelectLabel>
          <SelectItem value="bkk">กรุงเทพฯ</SelectItem>
          <SelectItem value="cnx">เชียงใหม่</SelectItem>
          <SelectItem value="hkt">ภูเก็ต</SelectItem>
          <SelectItem value="kkc">ขอนแก่น</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
// #endregion

// #region combobox
const frameworks = ["Next.js", "Remix", "Astro", "Nuxt", "SvelteKit"]

export function ComboboxExample() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-56 justify-between font-normal">
          {value || "เลือกเฟรมเวิร์ก…"}
          <AltArrowDownIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandInput placeholder="ค้นหา…" />
          <CommandList>
            <CommandEmpty>ไม่พบผลลัพธ์</CommandEmpty>
            <CommandGroup>
              {frameworks.map((f) => (
                <CommandItem
                  key={f}
                  value={f}
                  onSelect={(v) => {
                    setValue(v === value ? "" : v)
                    setOpen(false)
                  }}
                >
                  {f}
                  <CheckIcon className={cn("ml-auto", value === f ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
// #endregion

// #region checkbox
export function CheckboxExample() {
  return (
    <div className="grid gap-3">
      {["แจ้งเตือนทางอีเมล", "แจ้งเตือนทาง LINE", "สรุปรายสัปดาห์"].map((label, i) => (
        <Label key={label} className="font-normal">
          <Checkbox defaultChecked={i === 0} />
          {label}
        </Label>
      ))}
    </div>
  )
}
// #endregion

// #region switch
export function SwitchExample() {
  return (
    <Label className="flex w-full max-w-sm items-center justify-between gap-4 rounded-lg border p-3 font-normal">
      <span className="grid gap-0.5">
        <span className="font-medium">โหมดบำรุงรักษา</span>
        <span className="text-xs text-muted-foreground">ปิดหน้าร้านชั่วคราว มีผลทันที</span>
      </span>
      <Switch />
    </Label>
  )
}
// #endregion

// #region radio-group
export function RadioGroupExample() {
  return (
    <RadioGroup defaultValue="monthly">
      {[
        ["monthly", "รายเดือน — ฿990"],
        ["yearly", "รายปี — ฿9,900 (ประหยัด 17%)"],
      ].map(([v, l]) => (
        <Label key={v} className="font-normal">
          <RadioGroupItem value={v} />
          {l}
        </Label>
      ))}
    </RadioGroup>
  )
}
// #endregion

// #region toggle-group
export function ToggleGroupExample() {
  return (
    <ToggleGroup type="single" variant="outline" defaultValue="week">
      <ToggleGroupItem value="day">วัน</ToggleGroupItem>
      <ToggleGroupItem value="week">สัปดาห์</ToggleGroupItem>
      <ToggleGroupItem value="month">เดือน</ToggleGroupItem>
    </ToggleGroup>
  )
}
// #endregion

// #region dialog
export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <TrashBinTrashIcon />
          ลบโปรเจกต์
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ลบโปรเจกต์นี้?</DialogTitle>
          <DialogDescription>ข้อมูลทั้งหมดจะถูกลบถาวรและไม่สามารถกู้คืนได้</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => toast.success("ลบโปรเจกต์แล้ว")}>
              ลบถาวร
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
// #endregion

// #region sheet
export function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">เปิดรายละเอียด</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>ORD-24081</SheetTitle>
          <SheetDescription>สมชาย ใจดี · ชำระแล้ว · ฿4,350</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4 text-sm">
          <Skeleton className="h-24" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
// #endregion

// #region dropdown-menu
export function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          บัญชี
          <AltArrowDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start">
        <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserRoundedIcon /> โปรไฟล์
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon /> ตั้งค่า
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Logout2Icon /> ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
// #endregion

// #region popover
export function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">ตั้งค่าขนาด</Button>
      </PopoverTrigger>
      <PopoverContent className="grid w-64 gap-3">
        <p className="text-sm font-medium">ขนาดรูปภาพ</p>
        {["กว้าง", "สูง"].map((l) => (
          <div key={l} className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor={`ex-${l}`}>{l}</Label>
            <Input id={`ex-${l}`} defaultValue="1080px" className="col-span-2 h-8" />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
// #endregion

// #region tooltip
const tools = [
  { icon: PenIcon, label: "แก้ไข" },
  { icon: CopyIcon, label: "ทำสำเนา" },
  { icon: TrashBinTrashIcon, label: "ลบ" },
]

export function TooltipExample() {
  return (
    <div className="flex gap-2">
      {tools.map(({ icon: I, label }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label={label}>
              <I />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
// #endregion

// #region tabs
export function TabsExample() {
  return (
    <Tabs defaultValue="general" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="general">ทั่วไป</TabsTrigger>
        <TabsTrigger value="billing">การชำระเงิน</TabsTrigger>
        <TabsTrigger value="team">ทีม</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-muted-foreground">ตั้งค่าชื่อร้าน โลโก้ และภาษา</TabsContent>
      <TabsContent value="billing" className="text-muted-foreground">จัดการแพ็กเกจและใบกำกับภาษี</TabsContent>
      <TabsContent value="team" className="text-muted-foreground">เชิญสมาชิกและกำหนดสิทธิ์</TabsContent>
    </Tabs>
  )
}
// #endregion

// #region card
export function CardExample() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>แพ็กเกจ Pro</CardTitle>
        <CardDescription>สำหรับทีมที่กำลังเติบโต</CardDescription>
        <CardAction>
          <Badge>แนะนำ</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">
          ฿990<span className="text-sm font-normal text-muted-foreground"> / เดือน</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">เริ่มทดลองใช้ฟรี</Button>
      </CardFooter>
    </Card>
  )
}
// #endregion

// #region badge
export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline" className="border-transparent bg-success/10 text-success">
        ชำระแล้ว
      </Badge>
      <Badge variant="outline" className="border-transparent bg-warning/15 text-foreground">
        รอชำระ
      </Badge>
    </div>
  )
}
// #endregion

// #region avatar
export function AvatarExample() {
  return (
    <div className="flex items-center gap-6">
      <Avatar>
        <AvatarFallback>ปท</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {["สจ", "NK", "ดส", "TW"].map((i) => (
          <Avatar key={i}>
            <AvatarFallback>{i}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}
// #endregion

// #region table
export function TableExample() {
  const rows = [
    ["INV-001", "ชำระแล้ว", 2500],
    ["INV-002", "รอชำระ", 1250.5],
    ["INV-003", "ชำระแล้ว", 18900],
  ] as const
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ใบแจ้งหนี้</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">ยอดเงิน</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([id, status, amount]) => (
          <TableRow key={id}>
            <TableCell className="font-mono text-xs">{id}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell className="text-right">
              {amount.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
// #endregion

// #region breadcrumb
export function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">หน้าหลัก</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">คำสั่งซื้อ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>ORD-24081</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
// #endregion

// #region toast
export function ToastExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.success("บันทึกแล้ว", { description: "การเปลี่ยนแปลงมีผลทันที" })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("บันทึกไม่สำเร็จ", { description: "กรุณาลองใหม่อีกครั้ง" })}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1500)), {
            loading: "กำลังอัปโหลด…",
            success: "อัปโหลดเสร็จแล้ว",
            error: "อัปโหลดล้มเหลว",
          })
        }
      >
        Promise
      </Button>
      <Button
        variant="outline"
        onClick={() => toast("ลบรายการแล้ว", { action: { label: "เลิกทำ", onClick: () => toast("กู้คืนแล้ว") } })}
      >
        With action
      </Button>
    </div>
  )
}
// #endregion

// #region alert
export function AlertExample() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert>
        <InfoCircleIcon />
        <AlertTitle>มีเวอร์ชันใหม่</AlertTitle>
        <AlertDescription>รีเฟรชหน้าเพื่อใช้งานฟีเจอร์ล่าสุด</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <DangerTriangleIcon />
        <AlertTitle>บัตรเครดิตหมดอายุ</AlertTitle>
        <AlertDescription>อัปเดตวิธีชำระเงินภายใน 7 วันเพื่อหลีกเลี่ยงการระงับบริการ</AlertDescription>
      </Alert>
    </div>
  )
}
// #endregion

// #region progress
export function ProgressExample() {
  const [value, setValue] = React.useState(24)
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Progress value={value} aria-label="ความคืบหน้า" />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 20))}>
          −20
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 20))}>
          +20
        </Button>
      </div>
    </div>
  )
}
// #endregion

// #region skeleton
export function SkeletonExample() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}
// #endregion

// #region separator
export function SeparatorExample() {
  return (
    <div className="w-full max-w-sm text-sm">
      <p className="font-medium">Ecsight Design System</p>
      <p className="text-muted-foreground">shadcn · Motion · Solar</p>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3">
        <span>เอกสาร</span>
        <Separator orientation="vertical" />
        <span>คอมโพเนนต์</span>
        <Separator orientation="vertical" />
        <span>ตัวอย่าง</span>
      </div>
    </div>
  )
}
// #endregion

// #region chart
const chartConfig = { web: { label: "เว็บไซต์", color: "var(--chart-1)" } } satisfies ChartConfig

export function ChartExample() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full max-w-xl">
      <AreaChart data={revenueSeries.slice(-14)}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(v: string) => v.slice(8)} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area dataKey="web" type="natural" fill="var(--color-web)" fillOpacity={0.15} stroke="var(--color-web)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  )
}
// #endregion

// #region sidebar
export function SidebarExample() {
  return (
    <p className="text-sm text-muted-foreground">
      Sidebar ใช้งานผ่าน block{" "}
      <Link className="text-primary underline-offset-4 hover:underline" href="/blocks/app-shell">
        App Shell
      </Link>{" "}
      เสมอ — ไม่ประกอบเองในแต่ละแอป
    </p>
  )
}
// #endregion

// #region icon
export function IconExample() {
  const [liked, setLiked] = React.useState(false)
  const [starred, setStarred] = React.useState(true)
  const [subscribed, setSubscribed] = React.useState(false)
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-pressed={liked} aria-label="ถูกใจ" onClick={() => setLiked((v) => !v)}>
        <Icon as={HeartIcon} activeAs={HeartBold} active={liked} className={liked ? "text-destructive" : undefined} />
      </Button>
      <Button variant="outline" size="icon" aria-pressed={starred} aria-label="ติดดาว" onClick={() => setStarred((v) => !v)}>
        <Icon as={StarIcon} activeAs={StarBold} active={starred} className={starred ? "text-warning" : undefined} />
      </Button>
      <Button variant="outline" aria-pressed={subscribed} onClick={() => setSubscribed((v) => !v)}>
        <Icon as={BellIcon} activeAs={BellBold} active={subscribed} />
        {subscribed ? "ติดตามแล้ว" : "ติดตาม"}
      </Button>
    </div>
  )
}
// #endregion

// #region logo
export function LogoExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <LogoMark className="size-8" />
      <Logo className="text-lg" markClassName="size-7" />
      <div className="grid size-12 place-items-center rounded-xl bg-primary">
        <LogoMark className="size-7 text-primary-foreground" />
      </div>
      <div className="grid size-12 place-items-center rounded-xl bg-foreground">
        <LogoMark className="size-7 text-background" />
      </div>
    </div>
  )
}
// #endregion

// #region spinner
export function SpinnerExample() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="size-6 text-primary" />
      <Button disabled>
        <Spinner />
        กำลังโหลด
      </Button>
    </div>
  )
}
// #endregion

// #region animated-number
export function AnimatedNumberExample() {
  const [value, setValue] = React.useState(128450)
  return (
    <div className="grid justify-items-start gap-3">
      <AnimatedNumber
        value={value}
        format={{ style: "currency", currency: "THB", maximumFractionDigits: 0 }}
        className="text-3xl font-semibold"
      />
      <Button size="sm" variant="outline" onClick={() => setValue((v) => v + 12500)}>
        เพิ่มยอดขาย
      </Button>
    </div>
  )
}
// #endregion

// #region empty-state
export function EmptyStateExample() {
  return (
    <EmptyState
      icon={FolderOpenIcon}
      title="ยังไม่มีโปรเจกต์"
      description="สร้างโปรเจกต์แรกเพื่อเริ่มติดตามงานของทีม"
      action={
        <Button>
          <AddCircleIcon />
          สร้างโปรเจกต์
        </Button>
      }
    />
  )
}
// #endregion

export const examples: Record<string, React.ComponentType> = {
  button: ButtonExample,
  accordion: AccordionExample,
  field: FieldExample,
  "count-badge": CountBadgeExample,
  input: InputExample,
  "input-group": InputGroupExample,
  textarea: TextareaExample,
  label: LabelExample,
  select: SelectExample,
  combobox: ComboboxExample,
  checkbox: CheckboxExample,
  switch: SwitchExample,
  "radio-group": RadioGroupExample,
  "toggle-group": ToggleGroupExample,
  dialog: DialogExample,
  sheet: SheetExample,
  "dropdown-menu": DropdownMenuExample,
  popover: PopoverExample,
  tooltip: TooltipExample,
  tabs: TabsExample,
  card: CardExample,
  badge: BadgeExample,
  avatar: AvatarExample,
  table: TableExample,
  breadcrumb: BreadcrumbExample,
  toast: ToastExample,
  alert: AlertExample,
  progress: ProgressExample,
  skeleton: SkeletonExample,
  separator: SeparatorExample,
  chart: ChartExample,
  sidebar: SidebarExample,
  icon: IconExample,
  logo: LogoExample,
  calendar: CalendarExample,
  "date-picker": DatePickerExample,
  form: FormExample,
  spinner: SpinnerExample,
  "animated-number": AnimatedNumberExample,
  "empty-state": EmptyStateExample,
}
