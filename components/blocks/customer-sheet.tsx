"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "motion/react"
import { useForm } from "react-hook-form"
import { DangerTriangleIcon } from "@solar-icons/react/linear"
import { toast } from "sonner"
import { z } from "zod"

import { spring } from "@/lib/motion"
import { email, optional, required, thaiMobile } from "@/lib/validation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  name: required("ชื่อลูกค้า"),
  email,
  phone: optional(thaiMobile),
  segment: z.enum(["consumer", "smb", "enterprise"]),
  contact: z.enum(["line", "email", "phone"]),
  notes: z.string().max(500, "หมายเหตุยาวได้ไม่เกิน 500 ตัวอักษร"),
  welcome: z.boolean(),
})

type Values = z.input<typeof schema>

const defaults: Values = { name: "", email: "", phone: "", segment: "smb", contact: "line", notes: "", welcome: true }

/* Demo backend: `taken@example.com` is already registered; `fail@example.com` makes the save fail. */
const fakeApi = {
  emailTaken: async (value: string) => {
    await new Promise((r) => setTimeout(r, 500))
    return value.toLowerCase() === "taken@example.com"
  },
  save: async (values: z.output<typeof schema>) => {
    await new Promise((r) => setTimeout(r, 900))
    if (values.email === "fail@example.com") throw new Error("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ")
  },
}

/**
 * Block: create form in a side sheet — react-hook-form + zod.
 * States: errors on submit then live; async check (email already used) with
 * a spinner in the field; submitting (button `loading`); server error
 * (Alert above the fields, form keeps its values); success (toast, sheet
 * closes, form resets).
 */
export function CustomerSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [serverError, setServerError] = React.useState<string>()
  const [checkingEmail, setCheckingEmail] = React.useState(false)

  const form = useForm<Values, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })
  const { isSubmitting } = form.formState

  async function onSubmit(values: z.output<typeof schema>) {
    setServerError(undefined)
    setCheckingEmail(true)
    const taken = await fakeApi.emailTaken(values.email)
    setCheckingEmail(false)
    if (taken) {
      form.setError("email", { message: "อีเมลนี้ถูกใช้กับลูกค้ารายอื่นแล้ว" }, { shouldFocus: true })
      return
    }
    try {
      await fakeApi.save(values)
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ")
      return
    }
    setOpen(false)
    toast.success("เพิ่มลูกค้าเรียบร้อย", { description: `${values.name} ถูกเพิ่มในระบบแล้ว` })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        // Reset on open (not close): we also close programmatically after a save,
        // and resetting while the sheet slides out would flash empty fields.
        if (o) {
          form.reset(defaults)
          setServerError(undefined)
        }
        setOpen(o)
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>เพิ่มลูกค้าใหม่</SheetTitle>
            <SheetDescription>กรอกข้อมูลพื้นฐาน แก้ไขภายหลังได้เสมอ</SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-5 overflow-y-auto px-4">
            <AnimatePresence initial={false}>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto", transition: spring.gentle }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Alert variant="destructive" role="alert">
                    <DangerTriangleIcon />
                    <AlertTitle>บันทึกไม่สำเร็จ</AlertTitle>
                    <AlertDescription>{serverError} — ข้อมูลที่กรอกยังอยู่ ลองบันทึกอีกครั้ง</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <FormField
              control={form.control}
              name="name"
              label="ชื่อลูกค้า"
              render={({ field, control }) => <Input placeholder="เช่น บริษัท ทองไทย จำกัด" {...field} {...control} />}
            />
            <FormField
              control={form.control}
              name="email"
              label="อีเมล"
              description="ใช้ส่งใบเสร็จและการแจ้งเตือน"
              render={({ field, control }) => (
                <div className="relative">
                  <Input type="email" placeholder="name@company.com" autoComplete="off" {...field} {...control} />
                  {checkingEmail && (
                    <Spinner className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label="กำลังตรวจสอบอีเมล" />
                  )}
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              label="เบอร์มือถือ (ไม่บังคับ)"
              render={({ field, control }) => (
                <Input type="tel" inputMode="tel" placeholder="081-234-5678" {...field} {...control} />
              )}
            />
            <FormField
              control={form.control}
              name="segment"
              label="กลุ่มลูกค้า"
              render={({ field, control }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" onBlur={field.onBlur} {...control}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumer">บุคคลทั่วไป</SelectItem>
                    <SelectItem value="smb">ธุรกิจขนาดเล็ก (SMB)</SelectItem>
                    <SelectItem value="enterprise">องค์กร</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              label="ช่องทางติดต่อหลัก"
              render={({ field, control }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  id={control.id}
                  aria-label="ช่องทางติดต่อหลัก"
                  aria-invalid={control["aria-invalid"]}
                  className="grid-cols-3"
                >
                  {[
                    ["line", "LINE"],
                    ["email", "อีเมล"],
                    ["phone", "โทรศัพท์"],
                  ].map(([value, label]) => (
                    <Label
                      key={value}
                      htmlFor={`contact-${value}`}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 font-normal transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent"
                    >
                      <RadioGroupItem id={`contact-${value}`} value={value} />
                      {label}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              label="หมายเหตุ"
              render={({ field, control }) => (
                <Textarea placeholder="ข้อมูลเพิ่มเติม (ไม่บังคับ)" rows={3} {...field} {...control} />
              )}
            />
            <FormField
              control={form.control}
              name="welcome"
              render={({ field, control }) => (
                <Label htmlFor={control.id} className="flex items-start justify-between gap-4 rounded-lg border p-3 font-normal">
                  <span className="grid gap-0.5">
                    <span className="font-medium">ส่งอีเมลต้อนรับ</span>
                    <span className="text-xs text-muted-foreground">ส่งทันทีหลังบันทึก</span>
                  </span>
                  <Switch id={control.id} checked={field.value} onCheckedChange={field.onChange} />
                </Label>
              )}
            />
          </div>
          <SheetFooter className="flex-row justify-end border-t">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                ยกเลิก
              </Button>
            </SheetClose>
            <Button type="submit" loading={isSubmitting}>
              บันทึก
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
