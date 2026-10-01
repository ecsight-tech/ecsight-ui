"use client"

import * as React from "react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react"
import {
  AddCircleIcon,
  ArrowUpIcon,
  BoxIcon,
  CartLarge2Icon,
  Chart2Icon,
  CheckCircleIcon,
  CodeSquareIcon,
  CommandIcon,
  CursorIcon,
  DocumentTextIcon,
  FolderIcon,
  MagnifierIcon,
  PauseIcon,
  PenIcon,
  PenNewSquareIcon,
  PlayIcon,
  UsersGroupRoundedIcon,
  Widget5Icon,
} from "@solar-icons/react/linear"
import { siClaude } from "simple-icons"
import { cn } from "cn"

import { ease, spring } from "@/lib/motion"
import { agentFollowUp, agentSetupPrompt, registryNamespace } from "@/lib/site"
import { formatTHB } from "@/lib/format"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LogoMark } from "@/components/ui/logo"
import { Spinner } from "@/components/ui/spinner"

/* ─── script ───────────────────────────────────────────────────────────── */

const W = 960
const H = 560

const tools = [
  { Icon: DocumentTextIcon, label: "อ่าน design.md", note: "กติกา 9 ข้อ" },
  { Icon: PenIcon, label: "แก้ components.json", note: `+ ${registryNamespace}` },
  { Icon: CommandIcon, label: "ติดตั้ง foundation + customer-sheet", note: "19 ไฟล์" },
  { Icon: PenIcon, label: "แก้ app/layout.tsx", note: "+ Providers" },
  { Icon: PenIcon, label: "เพิ่มกติกาใน CLAUDE.md", note: "1 บรรทัด" },
  { Icon: CodeSquareIcon, label: "สร้าง app/customers/page.tsx", note: "11 บรรทัด" },
]

const steps = [
  { title: "วาง setup prompt", ms: 5600 },
  { title: "agent ทำให้ทั้งหมด", ms: 8600 },
  { title: "ได้หน้าใช้งานจริง", ms: 9200 },
] as const

type Focus = "composer" | "tools" | "result"
type Cursor = "hidden" | "away" | "add" | "save"

type Scene = {
  step: number
  pasted: boolean // the setup prompt is in the composer as a pasted block
  typed: string // the follow-up typed after it
  sent: boolean
  tools: number // tool rows shown
  done: number // tool rows finished
  reply: boolean
  result: boolean // the app, full stage, only for the result
  name: string // typed into the sheet's form
  email: string
  added: boolean // the new customer row is in the table
  focus: Focus | null
  cursor: Cursor
  pressed: boolean
  sheet: boolean
  toast: boolean
}

const empty: Scene = {
  step: 0,
  pasted: false,
  typed: "",
  sent: false,
  tools: 0,
  done: 0,
  reply: false,
  result: false,
  name: "",
  email: "",
  added: false,
  focus: null,
  cursor: "hidden",
  pressed: false,
  sheet: false,
  toast: false,
}

/** Finished state of a step — shown with reduced motion, while paused, and when jumping */
function finished(step: number): Scene {
  const all = tools.length
  if (step === 0) return { ...empty, pasted: true, typed: agentFollowUp, focus: "composer" }
  if (step === 1) return { ...empty, step, sent: true, tools: all, done: all, reply: true, focus: "tools" }
  return { ...empty, step, sent: true, tools: all, done: all, reply: true, result: true, added: true, toast: true }
}

/** Where a step starts when played */
function start(step: number): Scene {
  if (step === 0) return { ...empty }
  if (step === 1) return { ...empty, step, sent: true }
  return { ...finished(1), step, focus: null, toast: false }
}

/* ─── component ────────────────────────────────────────────────────────── */

/**
 * Overview hero: how easy it is — type one sentence to Claude Code (desktop),
 * the agent does every step, and the finished page fills the stage as a
 * before/after you can click through. A camera zooms onto the active part.
 * The stage is decorative; the copyable prompt lives in the Setup prompt
 * section. Pauses off-screen and in background tabs. Reduced motion: no
 * autoplay, no camera moves — finished frames only.
 */
export function InstallWalkthrough() {
  const reduce = useReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.35 })
  const [userPaused, setUserPaused] = React.useState(false)
  const [pageVisible, setPageVisible] = React.useState(true)
  const [scene, setScene] = React.useState<Scene>(() => finished(2))
  // bumping `run` restarts the timeline from the step currently on screen
  const [run, setRun] = React.useState(0)
  const playing = !reduce && !userPaused && inView && pageVisible

  React.useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible")
    onVis()
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  // Declared before the timeline effect so it's current when the timeline (re)starts.
  // The very first play starts from step 0 even though the static frame shows the result.
  const stepRef = React.useRef(0)
  const startedRef = React.useRef(false)
  React.useEffect(() => {
    if (startedRef.current) stepRef.current = scene.step
  }, [scene.step])

  // The timeline. Cancelling (pause, off-screen, jump) clears every pending timer.
  React.useEffect(() => {
    if (!playing) return
    startedRef.current = true
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        timers.push(setTimeout(() => (cancelled ? reject(new Error("cancel")) : resolve()), ms))
      })
    const set = (patch: Partial<Scene>) => {
      if (!cancelled) setScene((s) => ({ ...s, ...patch }))
    }

    const play = async (step: number) => {
      setScene(start(step))
      if (step === 0) {
        await wait(400)
        set({ focus: "composer" })
        await wait(700)
        set({ pasted: true }) // ⌘V: the whole setup prompt lands as one block
        await wait(900)
        for (let i = 1; i <= agentFollowUp.length; i++) {
          set({ typed: agentFollowUp.slice(0, i) })
          await wait(agentFollowUp[i - 1] === " " ? 40 : 22)
        }
        await wait(700)
        set({ sent: true, pasted: false, typed: "", focus: null })
        await wait(700)
      }
      if (step === 1) {
        set({ focus: "tools" })
        await wait(500)
        for (let n = 1; n <= tools.length; n++) {
          set({ tools: n })
          await wait(n === 3 ? 1300 : 750)
          set({ done: n })
          await wait(200)
        }
        set({ reply: true })
        await wait(1900)
      }
      if (step === 2) {
        set({ result: true, focus: "result" })
        await wait(1300)
        set({ cursor: "away" })
        await wait(150)
        set({ cursor: "add" })
        await wait(850)
        set({ pressed: true })
        await wait(150)
        set({ pressed: false, sheet: true, cursor: "away" })
        await wait(450)
        for (const [key, text] of [["name", newCustomer.name], ["email", newCustomer.email]] as const) {
          for (let i = 1; i <= text.length; i++) {
            set({ [key]: text.slice(0, i) })
            await wait(35)
          }
          await wait(250)
        }
        set({ cursor: "save" })
        await wait(850)
        set({ pressed: true })
        await wait(150)
        set({ pressed: false, sheet: false, added: true, toast: true, cursor: "hidden" })
        await wait(2600)
      }
      set({ focus: null })
      await wait(500)
    }

    ;(async () => {
      for (let step = stepRef.current; ; step = (step + 1) % steps.length) await play(step)
    })().catch((e) => {
      if (!(e instanceof Error && e.message === "cancel")) throw e
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [playing, run])

  const togglePlay = () => {
    if (!userPaused) setScene((s) => finished(s.step)) // freeze on a readable frame
    setUserPaused((p) => !p)
  }

  const jump = (step: number) => {
    startedRef.current = true
    if (!playing) setScene(finished(step))
    else {
      setScene(start(step))
      setRun((r) => r + 1)
    }
  }

  return (
    <div ref={rootRef} className="grid gap-3">
      <Stage scene={scene} zoom={!reduce} />

      {/* one quiet row: three steps as progress segments + pause */}
      <div className="flex items-center gap-3">
        <ol className="grid flex-1 grid-cols-3 gap-2" aria-label="ขั้นตอน">
          {steps.map((s, i) => {
            const active = i === scene.step
            const past = i < scene.step
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={active ? "step" : undefined}
                  className="group grid w-full gap-1.5 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="relative h-1 overflow-hidden rounded-full bg-muted">
                    <motion.span
                      key={`${i}-${active}-${run}-${playing}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      initial={{ width: past ? "100%" : "0%" }}
                      animate={{ width: past || (active && !playing) ? "100%" : active ? "100%" : "0%" }}
                      transition={active && playing ? { duration: s.ms / 1000, ease: "linear" } : { duration: 0 }}
                    />
                  </span>
                  <span
                    className={cn(
                      "truncate text-xs transition-colors sm:text-sm",
                      active ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <span className="tabular-nums">{i + 1}.</span> {s.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        {!reduce && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={userPaused ? "เล่น" : "หยุด"}
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            {userPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── stage ────────────────────────────────────────────────────────────── */

/** Position inside `root`, from offsets — unaffected by the camera's own transform */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

type Rect = { x: number; y: number; w: number; h: number }

function Stage({ scene, zoom }: { scene: Scene; zoom: boolean }) {
  const outerRef = React.useRef<HTMLDivElement>(null)
  const cameraRef = React.useRef<HTMLDivElement>(null)
  const composerRef = React.useRef<HTMLDivElement>(null)
  const toolsRef = React.useRef<HTMLDivElement>(null)
  const [fit, setFit] = React.useState(0)
  const [rect, setRect] = React.useState<Rect | null>(null)

  // Scale the fixed 960×560 stage to the available width
  React.useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setFit(entry.contentRect.width / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Measure the focused element (stage coordinates) once it has rendered. The result fills
  // the stage, so it needs no zoom — just no spotlight.
  React.useLayoutEffect(() => {
    const el = scene.focus === "composer" ? composerRef.current : scene.focus === "tools" ? toolsRef.current : null
    setRect(el && cameraRef.current ? offsetWithin(el, cameraRef.current) : null)
  }, [scene.focus, scene.tools, scene.reply, scene.sent, fit])

  // Camera: zoom so the target fills ~65% of the frame, centred, clamped to the stage edges
  const pad = 12
  let camera = { scale: 1, x: 0, y: 0 }
  if (rect && zoom) {
    const s = Math.max(1, Math.min(1.9, (0.65 * W) / (rect.w + pad * 2), (0.65 * H) / (rect.h + pad * 2)))
    const x = Math.min(0, Math.max(W - s * W, W / 2 - s * (rect.x + rect.w / 2)))
    const y = Math.min(0, Math.max(H - s * H, H / 2 - s * (rect.y + rect.h / 2)))
    camera = { scale: s, x, y }
  }

  return (
    <div
      ref={outerRef}
      aria-hidden
      // inert: the real components drawn inside (Button, Input, Table…) can't take focus or clicks
      inert
      className="relative w-full overflow-hidden rounded-2xl border bg-muted/40"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {fit > 0 && (
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${fit})` }}>
          <motion.div
            ref={cameraRef}
            className="relative origin-top-left"
            style={{ width: W, height: H }}
            initial={false}
            animate={camera}
            transition={{ duration: 0.75, ease: ease.out }}
          >
            <ClaudeDesktop scene={scene} composerRef={composerRef} toolsRef={toolsRef} />

            {/* spotlight: ring around the target, everything else dimmed */}
            <AnimatePresence>
              {rect && (
                <motion.div
                  key="spotlight"
                  className="pointer-events-none absolute rounded-2xl ring-2 ring-primary/70"
                  style={{ boxShadow: "0 0 0 2000px color-mix(in oklch, var(--background) 45%, transparent)" }}
                  initial={{ opacity: 0, left: rect.x - pad, top: rect.y - pad, width: rect.w + pad * 2, height: rect.h + pad * 2 }}
                  animate={{ opacity: 1, left: rect.x - pad, top: rect.y - pad, width: rect.w + pad * 2, height: rect.h + pad * 2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: ease.out }}
                />
              )}
            </AnimatePresence>

            {/* the result takes the whole stage */}
            <AnimatePresence>
              {scene.result && (
                <motion.div
                  key="result"
                  className="absolute inset-6"
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: spring.gentle }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: ease.in } }}
                >
                  <ResultWindow scene={scene} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function TrafficLights() {
  return (
    <span className="flex gap-1.5">
      <i className="size-3 rounded-full bg-[#ff5f57]" />
      <i className="size-3 rounded-full bg-[#febc2e]" />
      <i className="size-3 rounded-full bg-[#28c840]" />
    </span>
  )
}

const pop = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: ease.out } },
}

const pastedLines = agentSetupPrompt.split("\n").length

/** A long paste, shown the way chat apps collapse it: a card with the first line and a line count */
function PastedBlock() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border bg-background px-3 py-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <DocumentTextIcon className="size-4" />
      </span>
      <span className="grid min-w-0">
        <span className="truncate text-xs font-medium">{agentSetupPrompt.split("\n")[0]}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">Setup prompt · {pastedLines} บรรทัด</span>
      </span>
    </div>
  )
}

/** Claude Code as a desktop app: sessions sidebar, the thread, and the composer */
function ClaudeDesktop({
  scene,
  composerRef,
  toolsRef,
}: {
  scene: Scene
  composerRef: React.Ref<HTMLDivElement>
  toolsRef: React.Ref<HTMLDivElement>
}) {
  return (
    <div className="absolute inset-6 flex overflow-hidden rounded-2xl border bg-card text-[13px] shadow-sm">
      {/* sidebar */}
      <div className="flex w-[200px] shrink-0 flex-col gap-1 border-r bg-muted/40 p-3">
        <div className="mb-3 flex items-center gap-3 px-1 pt-1">
          <TrafficLights />
        </div>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium">
          <PenNewSquareIcon className="size-4" />
          New session
        </div>
        <p className="mt-3 px-2 text-[11px] text-muted-foreground">วันนี้</p>
        <div className={cn("truncate rounded-lg px-2 py-1.5", scene.sent ? "bg-background font-medium shadow-xs" : "text-muted-foreground")}>
          {scene.sent ? "ติดตั้ง Ecsight UI" : "เซสชันใหม่"}
        </div>
        <div className="truncate rounded-lg px-2 py-1.5 text-muted-foreground">แก้ฟอร์มสมัครสมาชิก</div>
        <div className="truncate rounded-lg px-2 py-1.5 text-muted-foreground">รีวิว PR #42</div>
      </div>

      {/* main */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center gap-2 border-b px-4">
          <svg viewBox="0 0 24 24" className="size-4" style={{ fill: `#${siClaude.hex}` }}>
            <path d={siClaude.path} />
          </svg>
          <span className="font-medium">Claude Code</span>
          <span className="ml-1 flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            <FolderIcon className="size-3.5" />
            my-app
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-3 overflow-hidden px-4 py-5">
          {!scene.sent && (
            <div className="grid flex-1 place-content-center justify-items-center gap-2 text-center text-muted-foreground">
              <svg viewBox="0 0 24 24" className="size-8" style={{ fill: `#${siClaude.hex}` }}>
                <path d={siClaude.path} />
              </svg>
              <p className="text-base font-medium text-foreground">วันนี้อยากให้ช่วยอะไร?</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {scene.sent && (
              <motion.div key="user" {...pop} className="ml-auto grid max-w-[85%] gap-2 rounded-2xl bg-muted p-2.5">
                <PastedBlock />
                <p className="px-1">{agentFollowUp}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {scene.tools > 0 && (
            <div ref={toolsRef} className="grid gap-1.5">
              {tools.slice(0, scene.tools).map((t, i) => {
                const done = i < scene.done
                return (
                  <motion.div key={t.label} {...pop} className="flex items-center gap-2.5 rounded-xl border px-3 py-2">
                    <t.Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span>{t.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground tabular-nums">{t.note}</span>
                    {done ? (
                      <CheckCircleIcon className="size-4 shrink-0 text-success" />
                    ) : (
                      <Spinner className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </motion.div>
                )
              })}
              <AnimatePresence initial={false}>
                {scene.reply && (
                  <motion.p key="reply" {...pop} className="pt-1">
                    เสร็จแล้ว — เปิด <span className="font-mono text-xs">localhost:3000/customers</span> ได้เลย
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* composer */}
          <div ref={composerRef} className="mt-auto grid gap-2 rounded-2xl border bg-background p-3 shadow-xs">
            <AnimatePresence initial={false}>
              {scene.pasted && (
                <motion.div key="pasted" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1, transition: spring.snappy }}>
                  <PastedBlock />
                </motion.div>
              )}
            </AnimatePresence>
            <p className={cn("min-h-10", !scene.typed && "text-muted-foreground")}>
              {scene.typed || (scene.pasted ? "" : "ให้ Claude ช่วยเขียนโค้ด…")}
              {scene.focus === "composer" && !scene.sent && (
                <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-foreground" />
              )}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Sonnet · Auto-accept edits</span>
              <motion.span
                animate={{ scale: scene.pasted || scene.typed ? 1 : 0.9, opacity: scene.pasted || scene.typed ? 1 : 0.4 }}
                className="grid size-7 place-items-center rounded-full bg-foreground text-background"
              >
                <ArrowUpIcon className="size-4" />
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const newCustomer = { name: "บริษัท ทองไทย จำกัด", email: "billing@thongthai.co.th", initials: "ทท" }

const customers = [
  { initials: "สจ", name: "สมชาย ใจดี", email: "somchai@example.com", tone: "success" as const, segment: "ลูกค้าประจำ", channel: "LINE OA", total: 48250 },
  { initials: "NK", name: "Nattaya K.", email: "nattaya@example.com", tone: "info" as const, segment: "ลูกค้าใหม่", channel: "Web", total: 3920 },
  { initials: "ดส", name: "ร้านกาแฟดอยสูง", email: "hello@doisoong.example", tone: "success" as const, segment: "ลูกค้าประจำ", channel: "Shopee", total: 126400 },
  { initials: "TW", name: "Thanakorn W.", email: "thanakorn@example.com", tone: "warning" as const, segment: "รอติดตาม", channel: "Lazada", total: 8600 },
  { initials: "มศ", name: "มาลี ศรีสุข", email: "malee@example.com", tone: "neutral" as const, segment: "ไม่เคลื่อนไหว", channel: "Web", total: 1760 },
]

const appNav = [
  { label: "ภาพรวม", Icon: Widget5Icon },
  { label: "คำสั่งซื้อ", Icon: CartLarge2Icon },
  { label: "ลูกค้า", Icon: UsersGroupRoundedIcon, active: true },
  { label: "สินค้า", Icon: BoxIcon },
  { label: "รายงาน", Icon: Chart2Icon },
]

/**
 * The finished page, full stage, built from the system's real components (the stage is inert):
 * add a customer through the CustomerSheet form → the row lands at the top of the table → toast.
 */
function ResultWindow({ scene }: { scene: Scene }) {
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const addRef = React.useRef<HTMLSpanElement>(null)
  const saveRef = React.useRef<HTMLSpanElement>(null)
  const [targets, setTargets] = React.useState<{ add?: Rect; save?: Rect }>({})

  // Where the pointer should go, measured from the real buttons
  React.useLayoutEffect(() => {
    const body = bodyRef.current
    if (!body) return
    setTargets({
      add: addRef.current ? offsetWithin(addRef.current, body) : undefined,
      save: saveRef.current ? offsetWithin(saveRef.current, body) : undefined,
    })
  }, [scene.result, scene.sheet])

  const aim = scene.cursor === "add" ? targets.add : scene.cursor === "save" ? targets.save : undefined
  const rows = scene.added
    ? [{ ...newCustomer, tone: "info" as const, segment: "ลูกค้าใหม่", channel: "Web", total: 0, isNew: true }, ...customers]
    : customers

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-2xl border bg-background shadow-xl">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b bg-muted/40 px-4">
        <TrafficLights />
        <span className="mx-auto rounded-md bg-background px-3 py-0.5 font-mono text-xs text-muted-foreground">
          localhost:3000/customers
        </span>
      </div>
      <div ref={bodyRef} className="relative flex flex-1 overflow-hidden">
        {/* app sidebar */}
        <div className="flex w-[176px] shrink-0 flex-col gap-0.5 border-r bg-sidebar p-3">
          <div className="mb-4 flex items-center gap-2 px-1.5 pt-1 font-semibold">
            <LogoMark className="size-5" />
            Ecsight
          </div>
          {appNav.map(({ label, Icon, active }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
                active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </div>
          ))}
        </div>

        {/* page */}
        <div className="grid min-w-0 flex-1 content-start gap-4 p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="grid">
              <p className="text-xl font-semibold">ลูกค้า</p>
              <p className="text-sm text-muted-foreground tabular-nums">
                ทั้งหมด {scene.added ? "483" : "482"} ราย
              </p>
            </div>
            <motion.span
              ref={addRef}
              animate={{ scale: scene.pressed && scene.cursor === "add" ? 0.95 : 1 }}
              transition={spring.bouncy}
            >
              <Button>
                <AddCircleIcon />
                เพิ่มลูกค้า
              </Button>
            </motion.span>
          </div>

          <div className="flex items-center gap-2">
            <InputGroup className="w-64">
              <InputGroupAddon>
                <MagnifierIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="ค้นหาชื่อ อีเมล…" />
            </InputGroup>
            <Button variant="outline" className="border-dashed">
              <AddCircleIcon className="text-muted-foreground" />
              กลุ่มลูกค้า
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">ลูกค้า</TableHead>
                  <TableHead>กลุ่ม</TableHead>
                  <TableHead>ช่องทาง</TableHead>
                  <TableHead className="pr-4 text-right">ยอดซื้อรวม</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {rows.map((c) => (
                    <motion.tr
                      key={c.email}
                      layout="position"
                      initial={{ opacity: 0, backgroundColor: "color-mix(in oklch, var(--success) 14%, transparent)" }}
                      animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)", transition: { duration: 1.6, ease: ease.out } }}
                      transition={spring.snappy}
                      className="border-b last:border-b-0"
                    >
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[11px]">{c.initials}</AvatarFallback>
                          </Avatar>
                          <div className="grid leading-tight">
                            <span className="font-medium">{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={c.tone}>{c.segment}</StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.channel}</TableCell>
                      <TableCell className="pr-4 text-right font-medium">{formatTHB(c.total)}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* the CustomerSheet, sliding in from the right */}
        <AnimatePresence>
          {scene.sheet && (
            <>
              <motion.div
                key="overlay"
                className="absolute inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                key="sheet"
                initial={{ x: "100%" }}
                animate={{ x: 0, transition: { duration: 0.26, ease: ease.out } }}
                exit={{ x: "100%", transition: { duration: 0.18, ease: ease.in } }}
                className="absolute inset-y-0 right-0 flex w-[340px] flex-col border-l bg-background shadow-xl"
              >
                <div className="grid gap-1 p-5 pb-4">
                  <p className="text-lg font-semibold">เพิ่มลูกค้าใหม่</p>
                  <p className="text-sm text-muted-foreground">กรอกข้อมูลพื้นฐาน แก้ไขภายหลังได้เสมอ</p>
                </div>
                <div className="grid gap-4 px-5">
                  <div className="grid gap-2">
                    <Label>ชื่อลูกค้า</Label>
                    <Input readOnly value={scene.name} placeholder="เช่น บริษัท ทองไทย จำกัด" />
                  </div>
                  <div className="grid gap-2">
                    <Label>อีเมล</Label>
                    <Input readOnly value={scene.email} placeholder="name@company.com" />
                    <p className="text-xs text-muted-foreground">ใช้ส่งใบเสร็จและการแจ้งเตือน</p>
                  </div>
                </div>
                <div className="mt-auto flex justify-end gap-2 border-t p-4">
                  <Button variant="outline">ยกเลิก</Button>
                  <motion.span
                    ref={saveRef}
                    animate={{ scale: scene.pressed && scene.cursor === "save" ? 0.95 : 1 }}
                    transition={spring.bouncy}
                  >
                    <Button>บันทึก</Button>
                  </motion.span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* pointer */}
        <AnimatePresence>
          {scene.cursor !== "hidden" && (
            <motion.div
              key="cursor"
              className="absolute z-10 text-foreground drop-shadow"
              initial={{ opacity: 0, left: 700, top: 300 }}
              animate={{
                opacity: 1,
                left: aim ? aim.x + aim.w * 0.6 : 700,
                top: aim ? aim.y + aim.h * 0.5 : 300,
                scale: scene.pressed ? 0.85 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: ease.out }}
            >
              <CursorIcon className="size-6 fill-background" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* toast, styled like the system Toaster */}
        <AnimatePresence>
          {scene.toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: spring.snappy }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.12, ease: ease.in } }}
              className="absolute right-5 bottom-5 flex w-[320px] items-start gap-3 rounded-xl border bg-popover p-3 shadow-lg"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                <CheckCircleIcon className="size-[18px]" />
              </span>
              <span className="grid gap-0.5 pt-[5px]">
                <span className="text-sm leading-snug font-medium">เพิ่มลูกค้าเรียบร้อย</span>
                <span className="text-[13px] leading-snug text-muted-foreground">{newCustomer.name} ถูกเพิ่มในระบบแล้ว</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
