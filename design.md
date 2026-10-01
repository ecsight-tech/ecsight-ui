# Ecsight Design System

> **Version** 0.2 · **Base** shadcn/ui (radix-nova) · **Motion** `motion/react` · **Icons** Solar (`@solar-icons/react`) · **Stack** Next.js App Router + Tailwind CSS v4
> **Gallery** `/` · **Live demo** `/demo` · **Registry** `/r/{name}.json`

This file is the contract for every Ecsight web app UI. It is written for **AI coding agents first** and for people second.
If you are an agent: treat every **MUST / MUST NOT** as a hard rule, follow the decision tables literally, and copy the code patterns instead of inventing new ones. When a rule and a user request conflict, follow the user and mention the rule you broke.

---

## 0. Quick rules (read this if nothing else)

1. **MUST** install UI from the Ecsight registry (`npx shadcn@latest add @ecsight/<name>`), never raw `shadcn add <name>` and never hand-rolled copies.
2. **MUST** use Solar icons. **MUST NOT** import `lucide-react`, `react-icons`, `@heroicons/*`, `@tabler/icons-react` or `@radix-ui/react-icons`.
3. **MUST** use semantic color tokens (`bg-primary`, `text-muted-foreground`, `bg-success/10`). **MUST NOT** use raw palette classes (`bg-blue-500`, `text-gray-600`) or hex values in components.
4. **MUST** take motion values from `@/lib/motion` (`spring.snappy`, `fadeUp`, …) or the CSS tokens (`duration-(--motion-base) ease-(--ease-spring)`). **MUST NOT** invent durations or easings.
5. **MUST** import Motion from `motion/react`, not `framer-motion`.
6. **MUST** write UI copy in Thai by default (see §6.7), with numbers, dates and currency formatted for `th-TH`.
7. **MUST** give every icon-only button an `aria-label` and (usually) a `Tooltip`.
8. **MUST** keep one primary (`variant="default"`) button per view region.

---

## 1. Principles

| Principle | What it means in practice |
|---|---|
| **Calm by default** | Neutral surfaces, one brand color, colour reserved for meaning (status, primary action, focus). |
| **Dense but readable** | Built for dashboards and back-office work: 36px controls, 14px UI text, tabular numbers, compact tables. |
| **Motion explains** | Every animation answers "what changed / where did it go / did it work?". No decorative loops. |
| **Thai-first** | Fonts, line-height and copy are tuned for Thai; English is the fallback, not the other way round. |
| **Own the code** | Components are copied into each app (shadcn model). Change them there if you must, but upstream fixes here first. |

---

## 2. Setup

### 2.1 New app

```bash
pnpm dlx create-next-app@latest my-app --ts --tailwind --eslint --app --use-pnpm
cd my-app
pnpm dlx shadcn@latest init -b radix -p nova
```

Add the registry to `components.json`:

```json
{
  "registries": {
    "@ecsight": "https://ecsight-design-system.vercel.app/r/{name}.json"
  }
}
```

Install the foundation once, then what you need:

```bash
npx shadcn@latest add @ecsight/foundation      # tokens, fonts, motion, providers
npx shadcn@latest add @ecsight/app-shell        # pulls sidebar, button, tooltip, … automatically
npx shadcn@latest add @ecsight/orders-table @ecsight/customer-sheet
```

Wrap the root layout (the CLI adds the fonts; you add `Providers`, `lang="th"` and `suppressHydrationWarning`):

```tsx
// app/layout.tsx
import { Providers } from "@/components/providers"

<html lang="th" suppressHydrationWarning className={/* font variables added by the CLI */}>
  <body>
    <Providers>{children}</Providers>
  </body>
</html>
```

`Providers` = `ThemeProvider` (next-themes, class strategy) + `MotionConfig reducedMotion="user"` + `TooltipProvider` + `Toaster`.

### 2.2 Lint guard

Add to `eslint.config.mjs`:

```js
{
  rules: {
    "no-restricted-imports": ["error", {
      paths: [
        { name: "lucide-react", message: "Use Solar icons (@solar-icons/react/linear)." },
        { name: "framer-motion", message: "Import from \"motion/react\"." },
      ],
      patterns: [{ group: ["react-icons", "react-icons/*", "@heroicons/*", "@tabler/icons-react", "@radix-ui/react-icons"], message: "Use Solar icons." }],
    }],
  },
}
```

> `components.json` keeps `"iconLibrary": "lucide"` because the shadcn CLI has no Solar option. That's fine — Ecsight registry items already import Solar. If you ever add an **upstream** shadcn component, replace its lucide imports using the map in §4.4.

---

## 3. Tokens

All tokens live in `app/globals.css` (installed by `@ecsight/foundation`) and are exposed to Tailwind via `@theme inline`.

### 3.1 Brand

```css
:root {
  --brand-h: 262.6;  /* Ecsight blue #0056FF = oklch(0.535 0.259 262.6) */
  --brand-c: 0.259;  /* chroma */
  --brand: oklch(0.535 var(--brand-c) var(--brand-h)); /* exact logo colour, same in dark mode */
}
```

- `primary` and `chart-1` in light mode **are** `--brand` (#0056FF). White text on it = 5.6:1 (AA).
- Dark mode lifts `primary` to `oklch(0.66 0.18 h)` for contrast on dark surfaces; `--brand` / `text-brand` stays #0056FF — use it only for the logo.

**Logo** — `<LogoMark />` (mark only, `currentColor`, defaults to `text-brand`) and `<Logo />` (mark + "Ecsight" wordmark). On a coloured or dark fill set the colour explicitly: `<LogoMark className="text-primary-foreground" />`. Don't put the mark inside a tinted box, stretch it, or recolour it with anything except brand, `foreground`, `background` or `primary-foreground`. Favicon is `app/icon.svg`.

Every brand-tinted token (`primary`, `accent`, `ring`, `chart-1`, sidebar, neutrals' tint) derives from `--brand-h` / `--brand-c`.
**To rebrand: convert the brand hex to OKLCH (oklch.com) and change these two numbers only.** Then re-check contrast of `primary` on `primary-foreground` (≥ 4.5:1).

### 3.2 Color (semantic)

| Token | Tailwind | Use for | Don't use for |
|---|---|---|---|
| `background` / `foreground` | `bg-background` `text-foreground` | Page, body text | — |
| `card` / `popover` | `bg-card` `bg-popover` | Raised surfaces, overlays | Page background |
| `primary` | `bg-primary` `text-primary` | The one main action, active nav, links, focus ring | Large backgrounds, decoration |
| `secondary` | `bg-secondary` | Secondary buttons, subtle fills | Status |
| `muted` / `muted-foreground` | `bg-muted` `text-muted-foreground` | Table header, descriptions, placeholders, meta text | Body text that must be read |
| `accent` / `accent-foreground` | `bg-accent` | Hover/selected rows, highlighted notes, icon tiles | Buttons |
| `destructive` | `text-destructive` `bg-destructive/10` | Delete, errors, negative trend | Warnings |
| `success` | `text-success` `bg-success/10` | Paid, completed, positive trend | Primary actions |
| `warning` | `bg-warning/15 text-foreground` | Pending, needs attention | Errors |
| `border` / `input` / `ring` | `border` `border-input` `ring-ring` | Dividers, field borders, focus | — |
| `chart-1…5` | `var(--chart-n)` | Data series, in order | UI chrome |

Status badges always use the **tinted** pattern: `bg-<status>/10 text-<status> border-transparent` (warning uses `/15` + `text-foreground` for contrast).

**Charts** — `--chart-1…5` = blue (brand) · rust · teal · plum · slate. Use them **in order**, max 5 series; fold the rest into "อื่น ๆ" on `chart-5`. Each colour is ≥ 3:1 against the card in both themes, and every pair stays distinguishable for red–green colour blindness (min ΔEok ≈ 11 light / 14 dark, simulated) — the palette leans on lightness steps, so don't swap in lookalike hues. Still label series directly or with a legend; never rely on colour alone.

### 3.3 Typography

| Role | Class | Notes |
|---|---|---|
| Page title | `text-2xl font-semibold tracking-tight` | One per page (`h1`) |
| Section title | `text-lg font-semibold` | `h2` |
| Card title | `CardTitle` (default) | KPI value: `text-2xl font-semibold` |
| UI / body | `text-sm` (14px) | Default for labels, cells, descriptions |
| Long-form body | `text-base` (16px) | Docs, onboarding |
| Meta | `text-xs text-muted-foreground` | Timestamps, hints |
| Code / IDs | `font-mono text-xs` | Order IDs, keys |

- Fonts: **IBM Plex Sans** (Latin) → **IBM Plex Sans Thai Looped** (Thai, looped = with heads, legible at small sizes) → **IBM Plex Mono** (`font-mono`). Stack: `--font-sans: var(--font-plex-sans), var(--font-plex-thai), …`.
- Thai line-height is built into the type scale (`--text-*--line-height` in `@theme`): xs 1.5 · sm 1.6 · base 1.65 · lg 1.6 · xl 1.5 · 2xl 1.45 · 3xl 1.35. Tailwind's `text-*` classes set line-height per element (overriding `:lang(th)`), so the scale itself carries it. Measured in Plex Thai Looped: typical Thai ink ≈ 0.94em, worst case (ปี่ ฏุ๊) ≈ 1.70em.
- **MUST NOT** use `leading-none` / `leading-tight` on anything that can hold Thai — stacked vowels/tone marks overlap the next line. `leading-snug` is the tightest allowed (single-line labels, titles).
- **MUST NOT** use negative tracking on Thai body text; `tracking-tight` is allowed on headings only.
- Numbers that are compared (tables, KPIs, money) **MUST** be `tabular-nums` (automatic inside `Table` and `[data-numeric]`).

### 3.4 Spacing, radius, size

| Token | Value | Use |
|---|---|---|
| `--radius` | `0.625rem` (10px) | Base. `rounded-lg` = 10px (controls), `rounded-xl` = 14px (cards), `rounded-md` = 8px (menu items) |
| Control height | `h-(--control-h)` = 36px default (32px compact) · `h-8` sm · `h-10` lg | Buttons, inputs, selects, input groups, tabs. Custom controls must use the token, not `h-9` |
| Icon button | `size-(--control-h)` · `icon-sm` = 32px | Toolbars, row actions use `icon-sm` |
| Table rows | `--table-head-h` 40px (36) · `--table-cell-py` 8px (4) | Built into `TableHead` / `TableCell` |
| Page padding | `p-4 md:p-6` | Inside `AppShell` |
| Section gap | `gap-4 md:gap-6` | Between page sections/cards |
| Form field gap | `gap-2` (label→field) · `gap-5` (field→field) | |

**Density** is a per-viewer preference: `useDensity()` (hooks/use-density.ts) stores it and sets `data-density="compact"` on `<html>`, which swaps the three tokens above. The account menu in `AppShell` has the switch (สบายตา / กระชับ). Add `densityScript` to `<head>` in the root layout so it applies before first paint.

### 3.5 Motion

| Token | CSS | JS (`@/lib/motion`) | Use |
|---|---|---|---|
| fast | `--motion-fast: 120ms` | `duration.fast` | Exits, hovers |
| base | `--motion-base: 180ms` | `duration.base` | Color/press transitions, overlays' backdrop |
| slow | `--motion-slow: 260ms` | `duration.slow` | Edge panels (sheet) |
| spring (CSS) | `--motion-spring: 320ms` + `--ease-spring` | — | Overlay enter (dialog, popover, menu, select, tooltip) |
| ease-out | `--ease-out` | `ease.out` | Everything non-spring entering |
| ease-in | `--ease-in` | `ease.in` | Everything exiting |
| snappy | — | `spring.snappy` (500/32) | **Default** for interactive motion: press, toggle, layout, nav indicator |
| gentle | — | `spring.gentle` (300/30) | Large surfaces, height changes, card entrance |
| bouncy | — | `spring.bouncy` (600/22) | Icon swaps, checkmarks, tiny badges only |

Presets in `@/lib/motion`: `pressable`, `popIn`, `fadeUp`, `listStagger` (30ms), `iconSwap`.

**Built-in motion per component** (don't re-add):

| Component | Motion |
|---|---|
| Tabs, Toggle Group (single), App Shell nav | Selection indicator glides (`layoutId` + `spring.snappy`) |
| Dialog, Popover, Dropdown, Select, Tooltip | Spring in (CSS), fast ease-in out |
| Sheet | Slide, ease-out 260ms, no overshoot |
| Accordion | Height ease-out 260ms, arrow rotates |
| Checkbox / Switch | Check zooms in / thumb slides on spring |
| Button | Press scale 0.97; `loading` overlays spinner |
| FieldError | Height + fade in; Field shakes once when invalid |
| Icon | Linear → Bold swap on bouncy spring |
| CountBadge | Pop in/out; digits roll by direction |
| AnimatedNumber, Progress | Ease-out, never overshoot |
| EmptyState, KPI cards, lists | Stagger `fadeUp` |

**Rules**

- Radix overlays animate via CSS automatically (foundation CSS targets `[data-slot$="-content"]`). Don't wrap them in Motion.
- Use Motion for: layout changes (`layout`, `layoutId`), list enter/exit (`AnimatePresence`), stateful swaps (`<Icon>`), counters (`AnimatedNumber`).
- Enter = spring or ease-out. Exit = `duration.fast` + `ease.in` (things leave faster than they arrive).
- **MUST NOT** overshoot when something is anchored to a screen edge (sheets, sidebars) or represents a real value (counters, progress).
- **MUST NOT** animate on every render, loop animations, or animate > 1 thing per interaction unless it's a staggered list.
- **MUST** keep `MotionConfig reducedMotion="user"` at the root; the global `prefers-reduced-motion` rule shortens CSS animations to 1ms.
- Stagger at most ~8 items; beyond that, animate the container.

```tsx
import { motion, AnimatePresence } from "motion/react"
import { fadeUp, listStagger, spring } from "@/lib/motion"

<motion.ul variants={listStagger} initial="hidden" animate="visible">
  {items.map((i) => <motion.li key={i.id} variants={fadeUp}>…</motion.li>)}
</motion.ul>

{active && <motion.span layoutId="tab-indicator" transition={spring.snappy} className="absolute inset-0 -z-10 rounded-md bg-muted" />}
```

---

## 4. Icons (Solar)

### 4.1 Styles

| Style | Import | Use |
|---|---|---|
| **Linear** | `@solar-icons/react/linear` | **Default everywhere** |
| **Bold** | `@solar-icons/react/bold` | Active/selected state only (via `<Icon>`) |
| **Bold Duotone** | `@solar-icons/react/bold-duotone` | Empty states and feature tiles only |
| Line Duotone, Outline, Broken | — | **MUST NOT** use |

### 4.2 Static icons

```tsx
import { MagnifierIcon, AddCircleIcon } from "@solar-icons/react/linear"

<Button><AddCircleIcon />เพิ่มลูกค้า</Button>   {/* size comes from the component (size-4) */}
```

- Inside shadcn components, **don't** set a size — they size `svg` to `size-4` (16px). Elsewhere: `size-4` (inline), `size-5` (nav/toolbars), `size-6` (empty state tile), `size-8` (feature tiles).
- Color inherits `currentColor`. Use `text-*` tokens only.
- Solar icons are plain SVG components with no React context, so they work in Server Components.

### 4.3 Stateful icons — `<Icon>`

Anything whose icon reflects state (active nav item, favourite, follow, show/hide password, theme toggle) **MUST** use `<Icon>` so the swap is animated consistently:

```tsx
import { HomeIcon } from "@solar-icons/react/linear"
import { HomeIcon as HomeBold } from "@solar-icons/react/bold"
import { Icon } from "@/components/ui/icon"

<Icon as={HomeIcon} activeAs={HomeBold} active={isCurrent} />
<Icon as={EyeIcon} activeAs={EyeClosedIcon} active={visible} />   // two different glyphs is fine too
```

Pass `label` only when the icon is the sole content; otherwise it's `aria-hidden`.

### 4.4 Lucide → Solar map (for porting upstream shadcn code)

| lucide | Solar (linear) |
|---|---|
| `XIcon` | `CloseIcon` |
| `SearchIcon` | `MagnifierIcon` |
| `CheckIcon` | `CheckIcon` |
| `ChevronDown/Up/Left/RightIcon` | `AltArrowDown/Up/Left/RightIcon` |
| `MoreHorizontalIcon` | `MenuDotsIcon` |
| `PanelLeftIcon` | `SidebarMinimalisticIcon` |
| `CircleCheckIcon` | `CheckCircleIcon` |
| `InfoIcon` | `InfoCircleIcon` |
| `TriangleAlertIcon` | `DangerTriangleIcon` |
| `OctagonXIcon` | `CloseCircleIcon` |
| `Loader2Icon` | `<Spinner />` (Solar has no spinner) |
| `PlusIcon` | `AddIcon` / `AddCircleIcon` |
| `TrashIcon` | `TrashBinTrashIcon` |
| `PencilIcon` | `PenIcon` |
| `SettingsIcon` | `SettingsIcon` |
| `UserIcon` | `UserRoundedIcon` |
| `LogOutIcon` | `Logout2Icon` |
| `DownloadIcon` | `DownloadMinimalisticIcon` |
| `ArrowUpDownIcon` | `SortVerticalIcon` |

Browse all 1,451 glyphs: https://solar-icons.vercel.app — component name = PascalCase(kebab name) + `Icon` (e.g. `cart-large-2` → `CartLarge2Icon`).

### 4.5 Attribution

Solar icons by **480 Design**, licensed **CC BY 4.0**. Every app **MUST** credit them once (footer, About, or Licenses page): *"Icons by 480 Design (Solar), CC BY 4.0"*.

---

## 5. Components

Install: `npx shadcn@latest add @ecsight/<name>`. Live examples and source: `/components/<name>`.

### 5.1 Actions

**Button** — `default` (primary, one per region) · `secondary` · `outline` (most secondary actions) · `ghost` (toolbars, row actions) · `destructive` · `link`. Sizes `sm | default | lg | icon | icon-sm`.
- Icon before label for actions, after label only for "next/open" (`ArrowRightIcon`).
- Pending: **`<Button loading={pending}>บันทึก</Button>`** — keeps colour, width and focus; spinner overlays the label; clicks/submits are ignored. **MUST NOT** fake it with `disabled` + manual spinner.
- Disabled: `disabled` shows `cursor-not-allowed` and no hover. Never disable without explaining why (tooltip or helper text).
- Motion: CSS press scale 0.97. Don't wrap Button in `motion.*`.

**Toggle Group** — segmented control for view/range switching (≤ 5 options). `variant="outline" size="sm"` in card headers. With `type="single"` the selection indicator glides between items automatically.

### 5.2 Forms

**Field** wraps every form control: `Field` → `FieldLabel` → control → `FieldDescription` → `FieldError`. Label **above** the field, single column, `gap-5` between fields.

```tsx
<Field data-invalid={!!errors.email}>
  <FieldLabel htmlFor="email">อีเมล</FieldLabel>
  <Input id="email" name="email" aria-invalid={!!errors.email} />
  <FieldDescription>ใช้ส่งใบเสร็จ</FieldDescription>
  <FieldError>{errors.email}</FieldError>   {/* animates in/out; renders nothing when empty */}
</Field>
```

- **Input Group** for leading icons (search), prefixes (`https://`), trailing buttons (copy, reveal password).
- **Select** for ≤ 12 static options; **Combobox** (Popover + Command) for more or searchable options.
- **Checkbox** for independent choices; **Radio Group** for 2–5 mutually exclusive visible options (use bordered "card" radios for important choices); **Switch** only for settings that take effect immediately (no Save button).
- **Real forms use `FormField`** (react-hook-form + zod). It renders the Field parts, sets `data-invalid`, wires `id` / `aria-invalid` / `aria-describedby`, and focuses the first invalid field on submit:

  ```tsx
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({ resolver: zodResolver(schema), defaultValues })
  <FormField control={form.control} name="email" label="อีเมล" description="ใช้ส่งใบเสร็จ"
    render={({ field, control }) => <Input type="email" {...field} {...control} />} />
  ```

  Non-input controls take `value` / `onValueChange` (Select, RadioGroup), `checked` / `onCheckedChange` (Switch) or `value` / `onChange` (DatePicker) from `field`, plus `{...control}`.
- **Schemas** come from `lib/validation.ts`: `required("ชื่อลูกค้า")`, `email`, `thaiMobile` (accepts dashes, outputs digits), `thaiTaxId` (13 digits + check digit), `optional(schema)` (empty → `undefined`). zod's Thai locale covers everything else.
- Validation timing: on submit, then live while the user fixes it (RHF default). Server-side checks (e.g. email already used) → `form.setError(name, { message }, { shouldFocus: true })` with a `Spinner` inside the field while checking. Messages go in `FieldError` — never toasts.
- **Dates** — all show พ.ศ.; pass `era="ce"` only for technical/export contexts.
  - `DateInput` — **default for form fields.** Typeable + calendar button. Understands `1/10/2569`, `01-10-69`, `01102569`, `1 ต.ค. 69`, Thai digits, พ.ศ. or ค.ศ.; rewrites to `1 ต.ค. 2569` on blur/Enter. Unparseable or disallowed text stays, turns red and reports `undefined`. Pass `onBlur={field.onBlur}` in forms.
  - `DatePicker` — button-only, for filters and short pickers. `×` clears (`clearable`, default on).
  - `DateRangePicker` — filters. Presets: วันนี้, 7/30 วันล่าสุด, เดือนนี้, เดือนที่แล้ว, ไตรมาสนี้, ปีนี้, **ปีงบประมาณนี้** (1 ต.ค.–30 ก.ย.). The range previews under the pointer before the second click. `maxDays` caps the span (and hides longer presets); `clearable={false}` when "no range" isn't valid. When data has a fixed end (reports, demos) use `createDateRangePresets(() => lastDay)`.
  - `Calendar` (inside all of them): months slide in the direction of travel; click the month caption for a 12-month grid, then the year for a 12-year grid (Esc steps back, never closes the popover); "วันนี้" jumps to the current month (`showToday={false}` to hide).
  - All three take `disabledDays` (any DayPicker matcher, e.g. `{ after: new Date() }`), `captionLayout="dropdown"` + `startMonth` / `endMonth` for far-away dates (birthdays).
  - **Sending dates to an API: `toISODate(d)`** from `lib/format.ts` → `"2026-10-01"`. Never `d.toISOString()` — it converts to UTC and gives the previous day for local midnight in Thailand. Read them back with `parseISODate(s)` (not `new Date(s)`, which is UTC too).
- Hover: controls darken their border on hover (built in); focus ring wins over hover; invalid wins over both.
- Submit area: right-aligned, `[Cancel (outline)] [Primary]`.

### 5.3 Overlays

| Need | Use |
|---|---|
| Confirm a destructive/irreversible action | **Dialog** (title as question, description states consequence, destructive button) |
| Create / edit an entity, view details | **Sheet** (right side, `sm:max-w-md`, form fills height, footer actions) |
| Small contextual form or info | **Popover** |
| List of actions on a thing | **Dropdown Menu** (destructive item last, separated, `variant="destructive"`) |
| Name an icon-only control | **Tooltip** (300ms delay) |
| Global search / commands | **Command** dialog on ⌘K (in `AppShell`) |

### 5.4 Feedback

| Situation | Use |
|---|---|
| Result of a user action (saved, deleted, exported) | **Toast** — `toast.success/error/promise`; add `action: { label: "เลิกทำ" }` for undoable deletes |
| Persistent page-level message (maintenance, billing) | **Alert** (dismissible with height animation) |
| Loading > 300ms with known layout | **Skeleton** matching the final layout |
| Loading inside a control | **Spinner** |
| Progress toward a known total | **Progress** |
| Nothing to show | **Empty State** — Bold Duotone icon + title + why + one action |
| Unread / pending count on an icon | **Count Badge** (positioned `absolute -top-0.5 -right-0.5` on the icon button) |

Never show a toast for something the user can already see changed in place.

### 5.5 Data display

- **Card**: `CardHeader` (title, description, `CardAction` top-right) → `CardContent` → `CardFooter`.
- **Badge**: status = tinted pattern (§3.2); counts = `default`.
- **Table**: header `bg-muted/40`; numbers right-aligned + `tabular-nums`; IDs `font-mono text-xs`; row actions = `ghost icon-sm` dropdown in last column; selection checkbox first column.
- **Data Table** block (`@ecsight/orders-table`) is the reference: TanStack Table v8, search + filter toolbar, sortable headers (`SortVerticalIcon`), selection count, pagination footer, `EmptyState` when filtered to zero, rows animate with `layout="position"`.
- **Chart**: Recharts via `ChartContainer`; colors from `--chart-1…5` in order; area/line for time series, bar for categories; tooltips via `ChartTooltipContent`; dates formatted `th-TH`.
- **Animated Number** for KPI values (counts up once in view; ease-out, never overshoots).
- **Avatar**: initials fallback (Thai initials are fine: `ปท`).

### 5.6 Navigation

- Every authenticated app uses the **App Shell** block: collapsible sidebar (`collapsible="icon"`, `variant="inset"`), top bar with `SidebarTrigger`, breadcrumb, ⌘K search, theme toggle, notifications, account menu.
- Nav items: Linear icon → Bold when active via `<Icon>`, plus the animated `layoutId` pill. Max ~7 top-level items; group with `SidebarGroupLabel`.
- **Tabs** for peer views inside one page/card — the active pill (or underline with `variant="line"`) glides between triggers; works controlled or uncontrolled. **Breadcrumb** for hierarchy (≥ 2 levels).
- **Accordion** for FAQs and "advanced" sections; never for primary content the user must see.

### 5.7 Ecsight-only components

| Component | Why it exists |
|---|---|
| `Icon` | Consistent animated Linear→Bold swaps |
| `Logo` / `LogoMark` | Brand mark, `currentColor` |
| `StatusBadge` | Record status: dot + label, tones `success · warning · info · danger · neutral`; `live` pulses for in-progress states. Map domain states → tones once, next to the data. Use instead of hand-tinted `Badge`s |
| `MultiSelect` | Several values from a list (tags, branches, assignees) — chips, search, groups, select all/clear. ≤ 5 always-visible options → checkboxes instead |
| `FileDropzone` | Uploads: drag/drop/click/paste, per-file progress, error + retry, rejection reasons in Thai. Pass `onUpload(file, onProgress)` |
| `Stepper` | Multi-step flows (import, onboarding). Only completed steps are clickable |
| `Timeline` | Activity feeds / record history with relative Thai time |
| `Kbd` / `KbdGroup` | Shortcut hints; `then` for sequences (G แล้ว O) |
| `Spinner` | Solar has no loader glyph |
| `AnimatedNumber` | KPI counters with `th-TH` formatting |
| `EmptyState` | Standard empty/zero-result pattern with staggered entrance |
| `CountBadge` | Unread/cart counts: pops in/out, digits roll by direction, `99+` cap, hidden at 0 |

---

## 6. Patterns

### 6.1 Page anatomy

```
AppShell
└─ header row: h1 + description (left) · actions (right: outline secondary, primary last)
└─ optional Alert
└─ KPI row (KpiCards, 4 across on xl, 2 on sm)
└─ main grid: lg:grid-cols-3 → chart (col-span-2) + side card
└─ section: h2 + description → table card
```

### 6.2 Loading

- < 300ms: show nothing. 300ms–10s: Skeleton in final layout (`aria-busy`). Long jobs: Progress or `toast.promise`.
- Never replace a whole page with a spinner.

### 6.3 Empty & error

- Empty first-use: Bold Duotone icon + what this area is for + primary action ("สร้างโปรเจกต์").
- Empty from filters: say so + "ล้างตัวกรอง" action.
- Error: say what failed and what to do; offer retry. Never show raw error codes alone.

### 6.4 Forms

- Create/edit in a Sheet; long multi-section settings get their own page with Cards per section.
- Optimistic UI only for reversible actions. Destructive → Dialog confirm (or toast with undo for soft deletes).
- After submit: pending state (`loading` on the submit button, from `formState.isSubmitting`) → close sheet → toast success. Field errors → inline. Save failed (network/server) → keep the sheet open, keep the values, show a destructive `Alert` at the top of the form. Reset the form when the sheet **opens**, not when it closes (no flash of empty fields).

### 6.5 Tables

- ≥ 20 rows → paginate (8–25 per page) or virtualize. Default sort is newest first.
- **Toolbar** (left → right): search (name/email/ID at minimum) · one `DataTableFacetedFilter` per categorical column (multi-select with live counts; column `filterFn: facetFilterFn`, table `getFacetedRowModel()` + `getFacetedUniqueValues()`) · "ล้างตัวกรอง" when anything is filtered · right side: `DataTableViewOptions` (show/hide columns via `meta.label`; persist `columnVisibility` with `useLocalStorage`) and export.
- **Bulk actions** live in `DataTableBulkBar` — floats up from the bottom only while rows are selected ("เลือก 3 รายการ", ≤ 3 actions, ✕ / Esc clears). Never put bulk actions in the toolbar.
- **Footer** is `DataTablePagination`: "แสดง 9–16 จาก 60 รายการ" (or the selection count), rows per page (8/20/50), first/prev/next/last.
- Pieces live in `components/blocks/data-table/`; `OrdersTable` is the reference composition.
- **Thousands of rows to scan** → `VirtualTable` (only visible rows render, sticky header, fixed 40px rows, no row animation). Filtering + bulk actions on a page of results → the Data Table.
- **View state lives in the URL** via nuqs: `useTableUrlState({ searchColumn, filterColumns, facetColumns, defaultSort, pageSize })` returns TanStack-ready `sorting` / `columnFilters` / `pagination` + handlers (`?q=&status=paid,shipped&sort=date.desc&page=2`; `facetColumns` hold string[]). Defaults stay out of the URL; search updates it after 300 ms with `replace`; paging forward `push`es (Back = previous page). Row selection stays local. Page-level filters (date range) use `useQueryStates` with `parseAsLocalDate` from `lib/search-params.ts` — never nuqs' `parseAsIsoDate`, which shifts dates by a day in UTC+7.
- Anything that reads the URL must sit inside `<Suspense>` on prerendered pages. Memoise filtered data on primitive keys (e.g. `date.getTime()`), not on the Date objects nuqs returns, or the table will keep resetting to page 1.

### 6.6 Responsive

- Mobile first. Sidebar becomes a Sheet below `md` (built in). Tables scroll horizontally inside their card; hide low-priority columns below `md`.
- Touch targets ≥ 36px; icon buttons ≥ 32px with an expanded hit area where tight.

### 6.7 Thai copy & formatting

- Thai by default; keep product names, technical terms and code in English (Dashboard → ภาพรวม is fine; API key stays "API key").
- Tone: polite, concise, no ending particles in UI labels (use "บันทึก", not "บันทึกค่ะ"); full sentences in descriptions.
- Buttons are verbs: บันทึก, ยกเลิก, ลบ, ส่งออก, เพิ่มลูกค้า. Pending: กำลังบันทึก…
- Format through `lib/format.ts` — never inline `Intl`/`toLocale*` in components:
  `formatDate(d)` → 1 ต.ค. 2569 (`style: "short" | "medium" | "long"`, `era: "ce"` for ค.ศ.), `formatDateRange(a, b)` → 1–7 ต.ค. 2569, `formatTime(d)` → 14:05, `formatTHB(n)` → ฿1,284,500 (`satang: true` for .00), `formatRelative(d)` → 3 นาทีที่ผ่านมา / เมื่อวาน. Plain counts: `toLocaleString("th-TH")`.
- Use the ellipsis character `…`, not `...`.

---

## 7. Accessibility (WCAG 2.2 AA)

- Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI boundaries). Re-verify when `--brand-h` changes.
- Every interactive element is reachable by keyboard and shows the focus ring (`focus-visible:ring-3 ring-ring/50`, built in). Never remove outlines.
- Icon-only controls: `aria-label` (Thai) + Tooltip. Toggle buttons: `aria-pressed`.
- Form controls: `<Label htmlFor>` or wrapping `<Label>`; errors via `aria-invalid` + visible text.
- Loading regions: `aria-busy="true"`; Spinner has `role="status"`.
- Motion: respect `prefers-reduced-motion` (handled globally) — don't bypass it with JS timers.
- `<html lang="th">` so screen readers and `:lang(th)` styles work.

---

## 8. For agents: building a screen

1. Start from `@ecsight/app-shell`. Put page content in its children.
2. Compose from registry items and blocks; check `/blocks` before building anything table-, form- or KPI-shaped.
3. Use only tokens from §3; if you need a new token, stop and ask.
4. Add motion only from §3.5 presets; if unsure, add none — the components already animate.
5. Write Thai copy per §6.7.
6. Self-check before finishing:
   - [ ] No `lucide-react` / other icon libs; stateful icons use `<Icon>`
   - [ ] No raw colors or arbitrary durations
   - [ ] One primary button per region; destructive actions confirmed
   - [ ] Loading (`Button loading`, Skeleton), empty and error (`FieldError`) states exist
   - [ ] Icon-only buttons labelled; keyboard reachable
   - [ ] Numbers tabular, money/dates `th-TH`
   - [ ] Works at 375px width and in dark mode

---

## 9. Maintaining this system

- Source of truth: this repo. `lib/catalog.ts` lists what ships; `pnpm registry:build` regenerates `registry.json` + `public/r/*.json` (dependencies are derived from imports).
- To add a component: build it in `components/ui`, add an example region in `components/examples/index.tsx`, add it to `lib/catalog.ts`, document it in §5, run `pnpm registry:build`.
- **Checks before merging** (all must pass):
  - `pnpm lint` and `pnpm lint:a11y` — the full jsx-a11y recommended set as errors; deliberate exceptions live in `scripts/lint-a11y.mjs` with their reasons.
  - `pnpm test:ui` — builds, then opens every gallery page (from `lib/catalog.ts`) in light/dark × desktop 1280/mobile 375 with the clock frozen at 1 ต.ค. 2569: axe WCAG 2.2 AA must report **zero serious/critical**, and each page must match its snapshot in `tests/ui/__snapshots__`. A new catalog entry is covered automatically.
  - Intended visual change → `pnpm test:ui:update`, then review the new PNGs in the diff before committing.
  - Snapshots are recorded on macOS with installed Chrome; a Linux CI needs its own baseline (run `test:ui:update` in the CI image once).
- Breaking changes (token rename, API change) → bump the version at the top and add a changelog line.

## 10. Changelog

- **0.5.1** (2026-10-01) — Quality gates: `pnpm test:ui` (Playwright + axe, 220 checks) and `pnpm lint:a11y`. Fixes they found: `--success` / `--destructive` darkened so text on their `/10` tint passes 4.5:1 (was 3.3 / 4.0); new `--warning-foreground`; code blocks use `github-light-high-contrast`; gallery logo link named on mobile; KPI sparklines no longer focusable inside `aria-hidden`; combobox example labelled; login "ลืมรหัสผ่าน" has a real href.
- **0.5** (2026-10-01) — Data table toolbar: faceted multi-select filters with live counts (`?status=paid,shipped`), show/hide columns remembered per viewer (`useLocalStorage`), floating bulk-action bar (Esc clears), pagination with rows-per-page. `VirtualTable` (10,000 rows). Density: `--control-h` / `--table-*` tokens + compact mode in the account menu, applied before paint. New: `MultiSelect`, `Kbd`, `StatusBadge`, `FileDropzone`, `Stepper`, `Timeline`, KPI sparklines. Shortcuts: ⌘K, `/`, G→X, `?` help (physical keys, so they work on the Thai layout). Thai-first line-height scale; no `leading-none` on Thai. CVD-checked chart palette. Fix: ⌘K palette crashed on open (shadcn v4 `CommandDialog` needs an explicit `<Command>`).
- **0.4.2** (2026-10-01) — Calendar: month slide animation (single-class keyframes in foundation CSS — react-day-picker toggles them with `classList`), month/year grid panel from the caption, "วันนี้" button; displayed month is now controlled inside Calendar (`month` / `onMonthChange` still work).
- **0.4.1** (2026-10-01) — `DateInput` (typeable Thai dates via `parseThaiDate`); range hover preview with day count; `×` clear on DatePicker/DateRangePicker; `maxDays`, `disabledDays`, `captionLayout`, `startMonth`/`endMonth` on all pickers; ปีงบประมาณนี้ preset; two-month range view now ends on the current month; `toISODate` / `parseISODate`. Fix: Calendar remounted its grid on every render (inline `Root`/`Chevron`), which stole focus back to the previously focused day.
- **0.4** (2026-10-01) — Calendar (react-day-picker v10, พ.ศ. via `@daypicker/buddhist`), DatePicker + DateRangePicker with presets; `lib/format.ts`; `FormField` (react-hook-form + zod) + Thai validators in `lib/validation.ts`; CustomerSheet rebuilt with async email check and server-error state; Data Table keeps search/filter/sort/page in the URL (nuqs, `useTableUrlState`); `NuqsAdapter` added to foundation; demo dashboard gets a URL-backed date range over 90 days of sample data.
- **0.3** (2026-10-01) — Real brand colour #0056FF (`--brand-h: 262.6`, `--brand-c: 0.259`, new `--brand` / `text-brand`); `Logo` + `LogoMark`; favicon `app/icon.svg`.
- **0.2.1** (2026-10-01) — Alert and Dialog no longer overflow with long Thai text/code; header nav scrolls on small screens.
- **0.2** (2026-10-01) — Tabs & Toggle Group sliding indicators; Accordion; Field with animated errors + shake; CountBadge; Button `loading`; hover border on inputs; disabled → `cursor-not-allowed` without hover.
- **0.1** (2026-10-01) — Initial release: foundation tokens (placeholder brand hue 262), IBM Plex Sans + Thai Looped, motion tokens/presets, Solar icons + `<Icon>`, 33 components, 6 blocks, demo dashboard, shadcn registry.
