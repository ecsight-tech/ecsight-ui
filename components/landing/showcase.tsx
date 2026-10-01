"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowRightUpIcon,
  MagnifierIcon,
  UsersGroupRoundedIcon,
} from "@solar-icons/react/linear"
import { cn } from "cn"

import { agentSetupPrompt } from "@/lib/site"
import { CopyButton } from "@/components/gallery/copy-button"
import { MotionDemo } from "@/components/landing/motion-demo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/**
 * Landing-page showcase: a masonry of live English examples built only from
 * registry components, so the page doubles as a smoke test of the system.
 */
export function Showcase() {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
      <ControlsCard />
      <OrdersCard />
      <SettingsCard />
      <RevenueCard />
      <CalendarCard />
      <SetupPromptCard />
      <SearchCard />
      <TabsCard />
      <ImportCard />
      <MotionCard />
    </div>
  )
}

function ControlsCard() {
  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <Button>
            Button
            <ArrowRightIcon />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <InputGroup>
          <InputGroupInput placeholder="Name" aria-label="Name" />
          <InputGroupAddon align="inline-end">
            <MagnifierIcon />
          </InputGroupAddon>
        </InputGroup>
        <Textarea placeholder="Message" aria-label="Message" />
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Checkbox defaultChecked aria-label="Example checkbox" className="ml-auto" />
          <Switch defaultChecked aria-label="Example switch" />
        </div>
      </CardContent>
    </Card>
  )
}

const orders: { id: string; customer: string; status: string; tone: StatusTone; live?: boolean; amount: string }[] = [
  { id: "ORD-24081", customer: "Siam Retail Co.", status: "Delivered", tone: "success", amount: "฿12,450" },
  { id: "ORD-24082", customer: "Bangkok Foods", status: "Shipping", tone: "info", live: true, amount: "฿3,890" },
  { id: "ORD-24083", customer: "Chiang Mai Crafts", status: "Unpaid", tone: "warning", amount: "฿860" },
  { id: "ORD-24084", customer: "Phuket Supply", status: "Cancelled", tone: "danger", amount: "฿2,140" },
]

function OrdersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Status badges stay readable without colour.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/blocks/orders-table">
              View all
              <ArrowRightUpIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="whitespace-normal">
                  <div className="font-medium">{o.customer}</div>
                  <div className="font-mono text-xs text-muted-foreground">{o.id}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={o.tone} live={o.live}>{o.status}</StatusBadge>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">{o.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const settings = [
  { id: "alerts", label: "Order alerts", note: "Email me when an order fails to ship.", on: true },
  { id: "digest", label: "Weekly digest", note: "A Monday summary of revenue and orders.", on: false },
  { id: "compact", label: "Compact tables", note: "Denser rows for long lists.", on: true },
]

function SettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Switches apply immediately.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {settings.map((s) => (
          <div key={s.id} className="flex items-start justify-between gap-4">
            <div className="grid gap-0.5">
              <Label htmlFor={`setting-${s.id}`}>{s.label}</Label>
              <p className="text-xs text-muted-foreground">{s.note}</p>
            </div>
            <Switch id={`setting-${s.id}`} defaultChecked={s.on} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const revenue = [42, 55, 48, 62, 58, 71, 66, 80, 74, 88, 83, 96, 90, 84, 92, 97, 88, 101, 95, 104, 99, 108, 102, 111, 106, 115, 109, 118, 112, 121]

function RevenueCard() {
  const [range, setRange] = React.useState("14")
  const bars = revenue.slice(-Number(range))
  const total = bars.reduce((a, b) => a + b, 0) * 1000

  return (
    <Card>
      <CardHeader>
        <CardDescription>Revenue</CardDescription>
        <CardTitle className="font-mono text-3xl tabular-nums">฿{total.toLocaleString("en-US")}</CardTitle>
        <CardAction>
          <ToggleGroup type="single" variant="outline" size="sm" value={range} onValueChange={(v) => v && setRange(v)}>
            <ToggleGroupItem value="7">7d</ToggleGroupItem>
            <ToggleGroupItem value="14">14d</ToggleGroupItem>
            <ToggleGroupItem value="30">30d</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div aria-hidden className="flex h-36 items-end gap-1">
          {bars.map((h, i) => (
            <div
              key={`${range}-${i}`}
              className="flex-1 rounded-t-sm bg-primary"
              style={{ height: `${(h / 121) * 100}%`, opacity: 0.35 + (i / bars.length) * 0.65 }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <span className="font-medium text-success">+12.4%</span>&nbsp;vs previous period
      </CardFooter>
    </Card>
  )
}

function CalendarCard() {
  // October 2026 (B.E. 2569) starts on a Thursday; weeks start on Sunday
  const offset = 4
  const [range, setRange] = React.useState<[number, number | null]>([7, 14])
  const [from, to] = range

  function pick(d: number) {
    if (to !== null || d < from) setRange([d, null])
    else setRange([from, d])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>October 2569</CardTitle>
        <CardDescription>Buddhist era by default, weeks start on Sunday.</CardDescription>
      </CardHeader>
      <CardContent>
        <div role="group" aria-label="October 2569" className="grid grid-cols-7 gap-y-1 text-center text-sm tabular-nums">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d} aria-hidden className="pb-1 text-xs text-muted-foreground">{d}</span>
          ))}
          {Array.from({ length: offset }, (_, i) => <span key={`pad-${i}`} />)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
            const edge = d === from || d === to
            const inRange = to !== null && d > from && d < to
            return (
              <button
                key={d}
                type="button"
                aria-pressed={edge || inRange}
                aria-label={`${d} October`}
                onClick={() => pick(d)}
                className={cn(
                  "mx-auto grid size-9 place-items-center rounded-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  edge && "bg-primary text-primary-foreground",
                  inRange && "w-full rounded-none bg-primary/10",
                  !edge && !inRange && "hover:bg-muted"
                )}
              >
                {d}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function SetupPromptCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paste into your agent</CardTitle>
        <CardDescription>One prompt sets up the registry, rules and foundation.</CardDescription>
        <CardAction>
          <CopyButton value={agentSetupPrompt} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre className="max-h-44 overflow-hidden rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
          {agentSetupPrompt}
        </pre>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/docs#setup-prompt">Read the setup guide</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const customers = ["Siam Retail Co.", "Bangkok Foods", "Chiang Mai Crafts", "Phuket Supply", "Khon Kaen Logistics"]

function SearchCard() {
  const [q, setQ] = React.useState("")
  const results = customers.filter((c) => c.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <Card>
      <CardContent className="grid gap-2">
        <InputGroup>
          <InputGroupAddon>
            <MagnifierIcon />
          </InputGroupAddon>
          <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" aria-label="Search customers" />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <ul aria-live="polite" className="grid gap-0.5 text-sm">
          {results.map((c) => (
            <li key={c} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
              <UsersGroupRoundedIcon className="size-4 text-muted-foreground" />
              {c}
            </li>
          ))}
          {results.length === 0 && <li className="px-2 py-6 text-center text-muted-foreground">No customers found.</li>}
        </ul>
      </CardContent>
    </Card>
  )
}

function TabsCard() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="grid grid-cols-2 gap-3 pt-3">
            <Stat label="Orders" value="3,421" delta="+8.1%" />
            <Stat label="New customers" value="482" delta="-3.2%" down />
          </TabsContent>
          <TabsContent value="orders" className="pt-3 text-sm text-muted-foreground">
            128 orders need attention today, 12 of them overdue.
          </TabsContent>
          <TabsContent value="customers" className="pt-3 text-sm text-muted-foreground">
            Top region this month is Bangkok, with 41% of new sign-ups.
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, delta, down }: { label: string; value: string; delta: string; down?: boolean }) {
  return (
    <div className="grid gap-1 rounded-lg border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-xl font-semibold tabular-nums">{value}</span>
      <span className={cn("text-xs font-medium", down ? "text-destructive" : "text-success")}>{delta}</span>
    </div>
  )
}

function ImportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importing orders</CardTitle>
        <CardDescription>4 teammates are watching this import.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex -space-x-2">
          {["KS", "NP", "AT", "WJ"].map((i) => (
            <Avatar key={i} className="ring-2 ring-card">
              <AvatarFallback className="text-xs">{i}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="grid gap-1.5">
          <div className="flex justify-between text-sm">
            <span>orders-2569-10.csv</span>
            <span className="font-mono tabular-nums text-muted-foreground">72%</span>
          </div>
          <Progress value={72} aria-label="Import progress" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">Cancel</Button>
        <Button className="flex-1" loading aria-label="Importing">Importing</Button>
      </CardFooter>
    </Card>
  )
}

function MotionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spring tokens</CardTitle>
        <CardDescription>Motion explains state changes. It is never decoration.</CardDescription>
      </CardHeader>
      <CardContent>
        <MotionDemo />
      </CardContent>
    </Card>
  )
}
