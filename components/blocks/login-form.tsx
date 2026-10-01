"use client"

import * as React from "react"
import { motion } from "motion/react"
import { EyeClosedIcon, EyeIcon } from "@solar-icons/react/linear"

import { fadeUp, listStagger } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoMark } from "@/components/ui/logo"

/** Block: sign-in card. Fields stagger in; password reveal swaps icon; submit shows pending state. */
export function LoginForm() {
  const [show, setShow] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <LogoMark className="mx-auto mb-2 size-9" />
        <CardTitle className="text-xl">เข้าสู่ระบบ Ecsight</CardTitle>
        <CardDescription>ใช้อีเมลบริษัทของคุณ</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.form
          variants={listStagger}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setPending(true)
            setTimeout(() => setPending(false), 1200)
          }}
        >
          <motion.div variants={fadeUp} className="grid gap-2">
            <Label htmlFor="login-email">อีเมล</Label>
            <Input id="login-email" type="email" placeholder="name@ecsight.example" autoComplete="email" required />
          </motion.div>
          <motion.div variants={fadeUp} className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">รหัสผ่าน</Label>
              <a href="/forgot-password" className="text-xs text-primary underline-offset-4 hover:underline">
                ลืมรหัสผ่าน?
              </a>
            </div>
            <InputGroup>
              <InputGroupInput
                id="login-password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  onClick={() => setShow((s) => !s)}
                >
                  <Icon as={EyeIcon} activeAs={EyeClosedIcon} active={show} />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Label className="font-normal">
              <Checkbox defaultChecked /> จดจำฉันไว้ในเครื่องนี้
            </Label>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Button type="submit" className="w-full" loading={pending}>
              เข้าสู่ระบบ
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  )
}
