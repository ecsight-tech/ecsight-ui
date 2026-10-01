import Link from "next/link"
import { ArrowRightIcon, PlayCircleIcon } from "@solar-icons/react/linear"
import * as Linear from "@solar-icons/react/linear"
import * as Outline from "@solar-icons/react/outline"
import * as Broken from "@solar-icons/react/broken"
import * as Bold from "@solar-icons/react/bold"
import * as LineDuotone from "@solar-icons/react/line-duotone"
import * as BoldDuotone from "@solar-icons/react/bold-duotone"

import { components } from "@/lib/catalog"
import { installCommand, registryNamespace, siteUrl } from "@/lib/site"
import { CodeBlock } from "@/components/gallery/code-block"
import { MotionPlayground } from "@/components/gallery/motion-playground"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const colorTokens = [
  ["background", "foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["accent", "accent-foreground"],
  ["muted", "muted-foreground"],
  ["destructive", "background"],
  ["success", "background"],
  ["warning", "warning-foreground"],
] as const

const chartTokens = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]

const iconStyles = [
  { name: "Linear", use: "Default — everywhere", Icon: Linear.Widget5Icon },
  { name: "Bold", use: "Active / selected state", Icon: Bold.Widget5Icon },
  { name: "Bold Duotone", use: "Empty states, feature tiles", Icon: BoldDuotone.Widget5Icon },
  { name: "Line Duotone", use: "Don't use", Icon: LineDuotone.Widget5Icon },
  { name: "Outline", use: "Don't use", Icon: Outline.Widget5Icon },
  { name: "Broken", use: "Don't use", Icon: Broken.Widget5Icon },
]

export default function OverviewPage() {
  return (
    <div className="grid gap-16">
      <section className="grid gap-5">
        <Badge variant="outline" className="w-fit">
          v0.2 · shadcn/ui + Motion + Solar
        </Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Ecsight Design System
        </h1>
        <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
          ชุดคอมโพเนนต์สำหรับสร้างเว็บแอปของทีม Ecsight — พื้นฐานจาก shadcn/ui เคลื่อนไหวด้วย spring ที่กระชับ
          ใช้ไอคอน Solar และรองรับภาษาไทยตั้งแต่ต้น
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="lg">
            <Link href="/demo">
              <PlayCircleIcon />
              ดู Demo dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/components/button">
              Components
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </section>

      <Section id="install" title="เริ่มต้นใช้งาน" description="เพิ่ม registry ของ Ecsight ใน components.json แล้วติดตั้งผ่าน shadcn CLI">
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock
            title="components.json"
            lang="json"
            code={JSON.stringify({ registries: { [registryNamespace]: `${siteUrl}/r/{name}.json` } }, null, 2)}
          />
          <CodeBlock
            title="terminal"
            lang="bash"
            code={[
              "# 1. tokens, fonts, motion, providers (ครั้งแรกครั้งเดียว)",
              installCommand("foundation"),
              "",
              "# 2. คอมโพเนนต์หรือ block ที่ต้องการ",
              installCommand("button"),
              installCommand("app-shell"),
            ].join("\n")}
          />
        </div>
      </Section>

      <Section id="color" title="สี" description="Token เชิงความหมาย (semantic) ทั้งหมดอิงจาก --brand-h ตัวเดียว เปลี่ยนสีแบรนด์ได้ในที่เดียว">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colorTokens.map(([bg, fg]) => (
            <div key={bg} className="overflow-hidden rounded-xl border">
              <div
                className="grid h-20 place-items-center text-sm font-medium"
                style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
              >
                Aa ภาษาไทย
              </div>
              <div className="px-3 py-2 font-mono text-xs">--{bg}</div>
            </div>
          ))}
        </div>
        {/* labels sit under the swatches: no single text colour reads on all five fills */}
        <div className="grid grid-cols-5 overflow-hidden rounded-xl border">
          {chartTokens.map((c) => (
            <div key={c} className="grid">
              <div className="h-12" style={{ background: `var(--${c})` }} />
              <span className="px-2 py-1.5 font-mono text-[0.65rem] text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="ตัวอักษร" description="IBM Plex Sans + IBM Plex Sans Thai Looped (มีหัว อ่านง่ายในตารางข้อมูล) · Plex Mono สำหรับรหัสและตัวเลข">
        <div className="grid gap-4 rounded-xl border p-6">
          <p className="text-4xl font-semibold tracking-tight">ภาพรวมยอดขาย Revenue overview</p>
          <p className="text-2xl font-semibold">หัวข้อส่วน Section heading</p>
          <p className="text-base">
            เนื้อหาหลักขนาด 16px สำหรับย่อหน้า ระยะบรรทัด 1.65 เพื่อไม่ให้สระบน-ล่างชนกัน เช่น “ปิ่น ญาติ ฎีกา ฐาน ฤๅษี”
          </p>
          <p className="text-sm text-muted-foreground">ข้อความรอง 14px — ใช้ใน UI ส่วนใหญ่ (label, cell, description)</p>
          <p className="font-mono text-sm tabular-nums">ORD-24081 · ฿1,284,500.00 · 2026-09-30</p>
        </div>
      </Section>

      <Section id="motion" title="Motion" description="Snappy spring 150–320ms · motion ต้องอธิบายการเปลี่ยนสถานะเสมอ ไม่ใช่เพื่อความสวยอย่างเดียว · เคารพ prefers-reduced-motion">
        <div className="rounded-xl border p-6">
          <MotionPlayground />
        </div>
      </Section>

      <Section id="icons" title="ไอคอน Solar" description="Linear เป็นค่าเริ่มต้น สลับเป็น Bold เมื่อ active ผ่าน <Icon> · Bold Duotone เฉพาะ empty state">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {iconStyles.map(({ name, use, Icon }) => (
            <div
              key={name}
              className="grid justify-items-center gap-2 rounded-xl border p-4 text-center data-[muted]:[&>svg]:opacity-40"
              data-muted={use === "Don't use" || undefined}
            >
              <Icon className="size-8 text-primary" />
              <span className="text-sm font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">{use}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="components" title="Components" description={`${components.length} คอมโพเนนต์ พร้อม motion — ติดตั้งทีละตัวผ่าน registry`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <Link key={c.slug} href={`/components/${c.slug}`} className="group">
              <Card className="h-full gap-1 py-4 transition-colors group-hover:border-primary/40 group-hover:bg-accent/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {c.title}
                    {c.custom && <Badge variant="secondary">Ecsight</Badge>}
                  </CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="grid scroll-mt-20 gap-5">
      <div className="grid gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}
