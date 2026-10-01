# แผนอัปเกรด UI: Ecsight DS v0.2

**วันที่:** 2026-10-01
**เป้าหมาย:** ทำให้ demo dashboard ดูเป็นของใช้งานจริง โดยเติม component และ pattern ที่ internal tool ต้องมีแต่ยังขาดอยู่ แล้วค่อยขัดเกลาและวางเครื่องมือคุมคุณภาพ
**ไม่อยู่ในขอบเขต:** เปลี่ยน stack หลัก (Next 16, Tailwind v4, shadcn radix-nova, motion, Solar) และเรื่องที่ตัดสินไปแล้วใน `design.md`

---

## กติกาที่ทุก phase ต้องทำตาม (Definition of Done ต่อ 1 component/block)

1. ใช้ Solar icons เท่านั้น ถ้าดึง component มาจาก shadcn หรือ registry อื่น ให้แปลง lucide เป็น Solar ตามตาราง `design.md` §4.4
2. ใช้ motion token จาก `lib/motion.ts` (snappy spring) ห้ามใส่ duration หรือ easing เอง
3. มี state ครบ: default, hover, focus-visible, disabled, loading, error และ empty (ถ้ามี)
4. เพิ่มเข้า `lib/catalog.ts` ระบุฟิลด์ `motion` ด้วยถ้ามีการเคลื่อนไหว
5. เพิ่มตัวอย่างไว้ใน `components/examples/index.tsx` ภายใต้ `#region <slug>`
6. อัปเดต `design.md`: เพิ่ม section ใน §5 หรือ §6 และบันทึกใน §10 Changelog
7. รัน `pnpm registry:build` แล้วตรวจว่า `registry.json` จับ dependency ถูก (สคริปต์อ่าน dependency จาก import อัตโนมัติ)
8. `pnpm lint` และ `pnpm build` ต้องผ่าน แล้วเปิดดูใน gallery ทั้ง light/dark และ 375px

---

## Phase 0: Brand จริง ✅ เสร็จ 2026-10-01 (v0.3)

**ติดอยู่ที่:** ยังไม่ได้ hex และ logo จริง

- เปลี่ยน `--brand-h` / `--brand-c` ใน `app/globals.css` (ตอนนี้เป็น placeholder 262)
- เช็ค contrast ของ `--primary`, `--accent-foreground` และ `--ring` ใน light/dark ให้ผ่าน AA
- ใส่ logo ใน `components/blocks/app-shell.tsx` และ favicon
- อัปเดต `design.md` §3.1

ขนาดงาน: S ทำเมื่อได้ค่ามาแล้ว

---

## Phase 1: สามอย่างแรก ✅ เสร็จ 2026-10-01 (v0.4)

**สิ่งที่ต่างจากแผนตอนลงมือ**
- react-day-picker ที่ติดตั้งได้เป็น **v10** ไม่ใช่ v9 ซึ่งแนะนำให้ใช้ `@daypicker/react` แทนชื่อเดิม และมี `@daypicker/buddhist` สำหรับปี พ.ศ. ให้ในตัว จึงไม่ต้องเขียน formatter เอง (ตั้ง `numerals="latn"` เพราะค่าเริ่มต้นของแพ็กเกจเป็นเลขไทย)
- `parseAsIsoDate` ของ nuqs แปลงผ่าน UTC ทำให้วันที่ใน URL เลื่อนไป 1 วันเมื่อใช้เวลาไทย จึงเขียน `parseAsLocalDate` เองไว้ใน `lib/search-params.ts`
- nuqs v2.10 ใช้ `limitUrlUpdates: debounce()` แทน `throttleMs`
- demo data ขยายเป็น 90 วันที่จบที่ `DEMO_TODAY` และเพิ่ม `createDateRangePresets(now)` เพื่อให้ preset มีข้อมูลเสมอ
- แก้บั๊กเดิมในสคริปต์ registry ที่ทำให้ `popover.tsx` ถูกนับเป็นไฟล์ของ combobox

### 1.1 Calendar, DatePicker, DateRangePicker (แสดงปี พ.ศ.)

**Dependencies:** `react-day-picker` (v9), `date-fns` (ใช้ locale `th`)

**ไฟล์**
- `components/ui/calendar.tsx`: เริ่มจาก `shadcn add calendar` แล้วเปลี่ยน chevron เป็น Solar `AltArrowLeft/Right`
- `components/ui/date-picker.tsx`: เป็น custom component ที่รวม Popover + Calendar มีสองแบบคือ `DatePicker` (วันเดียว) และ `DateRangePicker` (ช่วงวันที่ มี preset: วันนี้, 7 วัน, 30 วัน, เดือนนี้, ไตรมาสนี้)
- `lib/format.ts` (ไฟล์ใหม่): formatter กลางของระบบ
  - `formatDate(d, { era: "be" | "ce" })` ค่าเริ่มต้นเป็น พ.ศ. ใช้ `Intl.DateTimeFormat("th-TH")` ซึ่งให้ พ.ศ. อยู่แล้ว
  - `formatTHB(n)` ย้ายมาจาก `thb` ใน orders-table
  - `formatRelative(d)` แสดงเป็น "3 นาทีที่แล้ว" ด้วย `Intl.RelativeTimeFormat("th")`

**จุดที่ต้องตัดสินใจหรือตรวจตอนลงมือ**
- หัวปฏิทิน (caption) ต้องแสดงปีเป็น พ.ศ. ให้ตรวจก่อนว่า react-day-picker v9 รองรับ buddhist calendar ในตัวหรือไม่ ถ้าไม่ ให้ใช้ prop `formatters` (`formatCaption`, `formatYearDropdown`) แปลงปีเป็น +543
- วันแรกของสัปดาห์: ใช้วันอาทิตย์ตามปฏิทินไทยทั่วไป หรือวันจันทร์แบบ ISO? **ค่าเริ่มต้นที่เสนอคือวันอาทิตย์** และเปิดให้ override ผ่าน prop ได้

**Motion:** popover springs in (ตามมาตรฐานเดิม) ส่วน range highlight ใช้ transition สีแบบ fast โดยไม่มี spring

**เชื่อมเข้า demo:** ใส่ DateRangePicker ใน header ของ `app/demo/demo-dashboard.tsx` แล้วให้ `RevenueChart` และ `OrdersTable` กรองข้อมูลตามช่วงวันที่ที่เลือก

ขนาดงาน: M

### 1.2 Form validation: react-hook-form + zod

**Dependencies:** `react-hook-form`, `zod` (v4), `@hookform/resolvers`

**ไฟล์**
- `components/ui/form.tsx` (custom): helper บาง ๆ ที่ผูก RHF เข้ากับ `Field` ที่มีอยู่แล้ว ไม่สร้าง Field ชุดใหม่ซ้ำ
  - `FormField` ทำหน้าที่เป็น `Controller` ส่ง `data-invalid` และ `aria-invalid` ลงไปให้ `Field` แล้วแสดง `FieldError` (ซึ่งมี slide-open และ shake อยู่แล้ว)
  - เมื่อ submit แล้วไม่ผ่าน ให้โฟกัส field แรกที่ผิด (`shouldFocusError` เป็นค่าเริ่มต้นของ RHF) และสั่น field นั้นครั้งเดียว
- `lib/validation.ts`: schema และ message ภาษาไทยที่ใช้ร่วมกัน เช่น อีเมล, เบอร์มือถือไทย (`0[689]\d{8}`), เลขผู้เสียภาษี 13 หลักพร้อม checksum และช่องบังคับกรอก
  - ตรวจว่า zod v4 มี locale `th` ไหม ถ้ามีให้ใช้เป็นฐาน ถ้าไม่มีให้เขียน message เองใน schema

**Refactor:** เปลี่ยน `components/blocks/customer-sheet.tsx` จาก `useState` errors ที่เขียนเอง มาใช้ RHF + zod

**State ที่ต้องครบ:** pristine, dirty, validating (async เช่นเช็คอีเมลซ้ำ), invalid, submitting (ปุ่ม `loading`), success (toast + ปิด sheet), server error (`Alert` ที่ด้านบนของฟอร์ม)

ขนาดงาน: M

### 1.3 เก็บ state ของตารางไว้ใน URL ด้วย nuqs

**Dependencies:** `nuqs`

**ไฟล์**
- `components/providers.tsx`: ครอบด้วย `NuqsAdapter` (`nuqs/adapters/next/app`)
  - ⚖️ Trade-off: เท่ากับเพิ่ม `nuqs` เข้าไปใน foundation ซึ่งทุกแอปจะติดไปด้วย แต่ lib เล็กมาก และ adapter ต้องอยู่ใกล้ root อยู่แล้ว **ข้อเสนอคือยอมรับ**
- `hooks/use-table-url-state.ts` (ไฟล์ใหม่ สคริปต์ registry จะ bundle ให้อัตโนมัติ): map `q`, `status`, `sort`, `page`, `size`, `from`, `to` ↔ `SortingState`, `ColumnFiltersState` และ `PaginationState` ของ TanStack
- `components/blocks/orders-table.tsx`: เปลี่ยนจาก `useState` มาใช้ hook ข้างบน
  - ช่องค้นหาใช้ `throttleMs` และ `history: "replace"` เพื่อไม่ให้ history รก
  - การเปลี่ยนหน้าใช้ `history: "push"` เพื่อให้กด back ย้อนหน้าได้
  - row selection **ไม่**ต้องเก็บใน URL

**ต้องระวัง:** การอ่าน search params ในหน้า static ของ Next ต้องครอบด้วย `<Suspense>` ให้อ่าน `node_modules/next/dist/docs` เรื่อง `useSearchParams` ก่อนลงมือ (ตาม AGENTS.md)

**ตรวจ:** เมื่อกรองแล้ว refresh ต้องได้สถานะเดิม copy URL ไปเปิดแท็บใหม่ต้องเห็นเหมือนกัน และปุ่ม back ต้องย้อนหน้าได้

ขนาดงาน: S–M

---

## Phase 1.5: ปรับ date picker ✅ เสร็จ 2026-10-01 (v0.4.1)
ไฮไลต์ช่วงตามเมาส์, ปุ่ม × ล้างค่า, `maxDays`/`disabledDays`/`captionLayout` ใช้ได้ทุกตัว, `toISODate`, `DateInput` ที่พิมพ์ได้, preset ปีงบประมาณ v0.4.2 เพิ่ม animation ตอนเปลี่ยนเดือน, ตารางเลือกเดือน/ปี และปุ่ม "วันนี้" ใน Calendar ยังไม่ได้ทำ: แสดงเป็น bottom sheet บนมือถือ, เทียบกับช่วงก่อนหน้า, DateTimePicker, วันหยุดราชการ

## Phase 2: Data table toolbar และ component ที่ยังขาด ✅ เสร็จ 2026-10-01 (v0.5)

**สิ่งที่ต่างจากแผนตอนลงมือ**
- Pagination ทำเป็น `DataTablePagination` ใน `components/blocks/data-table/` แทน `components/ui/pagination.tsx` เพราะ `pagination` ของ shadcn คือ link nav คนละอย่างกัน
- `@number-flow/react` ไม่ได้ใช้ เพราะตัวที่มีอยู่ทำงานดีแล้ว และพิสูจน์ด้วยตาไม่ได้ว่าดีกว่าชัดเจน (animation ไม่วิ่งใน pane ที่ถูกซ่อน)
- G→X เขียน logic เอง เพราะ sequence หลายตัวใน `useHotkeys` เดียวใช้ buffer ร่วมกันจนรีเซ็ตทับกัน
- เจอบั๊กเดิม: ⌘K palette พังทุกครั้งที่เปิด เพราะ shadcn v4 `CommandDialog` ไม่ได้ครอบ `<Command>` ให้
- ตัวอักษรไทย: `text-*` ของ Tailwind ตั้ง line-height ทับ `:lang(th)` จึงต้องแก้ที่ type scale
- ชุดสีกราฟ: ของเดิมมี 2 สีที่ contrast ไม่ถึง 3:1 ในโหมดสว่าง และแยกไม่ออกสำหรับคนตาบอดสีแดง-เขียว จึงหาค่าใหม่ด้วยการคำนวณ

### 2.1 Data table toolbar มาตรฐาน (ต่อยอดจาก OrdersTable)
- **Faceted filter:** dropdown ที่เลือกได้หลายค่าพร้อมตัวนับ (ใช้ Popover + Command + Checkbox) มาแทน Select สถานะแบบเลือกได้ค่าเดียว
- **Column visibility:** menu สำหรับซ่อนหรือแสดงคอลัมน์ และจำค่าไว้ใน localStorage
- **Bulk action bar:** แถบที่ลอยขึ้นจากขอบล่างเมื่อมีแถวที่ถูกเลือก (motion spring) แสดง "เลือก n รายการ" พร้อม export, ยกเลิก และล้างการเลือก
- **Pagination component** แยกออกมาเป็น `components/ui/pagination.tsx` มีตัวเลือกขนาดหน้าและข้อความ "แสดง 1–8 จาก 120"
- แยก toolbar ออกเป็น `components/blocks/data-table/*` เพื่อให้นำไปใช้กับตารางอื่นได้

ขนาดงาน: M

### 2.2 Virtualization
- **Dependency:** `@tanstack/react-virtual`
- เพิ่มตัวอย่าง "ตาราง 10,000 แถว" ใน gallery ใช้ sticky header และไม่มีการแบ่งหน้า
- ปิด row layout animation เมื่อ virtualize (ไม่อย่างนั้น layout animation จะทำให้กระตุก)

ขนาดงาน: S

### 2.3 Density toggle
- ตรวจก่อนว่าความสูง 36px ผูกกับ token อยู่แล้วหรือ hardcode เป็น `h-9` ไว้ในแต่ละ component
- เพิ่ม `--control-h` และ `--row-h` แล้วกำหนด `[data-density="compact"]` ให้ control สูง 32px และแถวตารางเตี้ยลง
- ใส่ toggle ไว้ใน account menu ของ app-shell และเก็บค่าใน localStorage

ขนาดงาน: S–M (ขึ้นกับจำนวนที่ hardcode อยู่)

### 2.4 Component ใหม่
| Component | หมายเหตุ | ขนาด |
|---|---|---|
| `MultiSelect` | พัฒนาต่อจาก combobox เดิม แสดงค่าที่เลือกเป็น chip เรียงไว้ใน trigger | M |
| `Kbd` | แสดงปุ่มลัด ใช้ใน tooltip, menu และ ⌘K | S |
| `StatusDot` / status badge | รวม `statusTone` ที่ตอนนี้กระจายอยู่ใน orders-table มาเป็น variant เดียว | S |
| `FileDropzone` | ใช้ `react-dropzone` มี state ครบ: idle, drag-over, uploading (progress), error และ done | M |
| `Stepper` | ใช้ในฟอร์มหลายขั้นตอน | S |
| `Timeline` / activity feed | ใช้ `formatRelative` จาก `lib/format.ts` | S |
| KPI + sparkline | เพิ่ม mini chart ใน `kpi-cards` ด้วย Recharts ที่มีอยู่แล้ว | S |

### 2.5 Polish
- **Keyboard shortcuts:** เพิ่ม `react-hotkeys-hook` แล้วกำหนด `⌘K`, `/` (โฟกัสช่องค้นหา), `g o` และ `g d` (ไปหน้าต่าง ๆ) และ `?` (แสดง cheat sheet ใน dialog)
- **@number-flow/react:** ลองเทียบกับ `animated-number` ที่มีอยู่ ถ้าดีกว่าชัดเจนให้เปลี่ยนไส้ในแต่คง API เดิมไว้
- **Thai typography:** กำหนด `:lang(th)` ให้ `line-height` สูงกว่าภาษาอังกฤษ ตรวจ heading ภาษาไทยไม่ให้สระหรือวรรณยุกต์ซ้อนชนกัน แล้วอัปเดต `design.md` §3.3
- **Chart palette:** ทบทวน `--chart-1..5` ให้แยกกันออกในทั้งสองธีมและสำหรับคนตาบอดสี เพิ่มเป็น 8 สีถ้าจำเป็น ทำหลัง Phase 0 เพราะสีขึ้นกับ brand hue

---

## Phase 3: Quality tooling

- **Playwright + @axe-core/playwright**
  - อ่านรายการ slug จาก `lib/catalog.ts` แล้วเปิดทุกหน้าใน gallery ทั้ง light/dark และ 1280/375
  - ทำ visual snapshot ของทุกหน้า และรัน axe โดยต้องไม่มี violation ระดับ serious หรือ critical
- **eslint-plugin-jsx-a11y**
  - ⚠️ ติดเงื่อนไขเดียวกับงานแบน lucide ที่ค้างอยู่: hook `config-protection` ของ ecc บล็อกการแก้ `eslint.config.mjs` ต้องให้คุณแก้เองหรือปิด hook ชั่วคราว
- เพิ่ม script `pnpm test:ui`

ขนาดงาน: M

---

## ลำดับและ dependency

```
Phase 0 (brand) ──────────────────────────────┐  (คู่ขนาน, block แค่ 2.5 chart palette)
1.1 lib/format.ts + DatePicker ─┐             │
1.2 RHF + zod ──────────────────┼─ 1.3 nuqs ──┴─ 2.1 toolbar ─ 2.2 virtual ─ 2.3 density ─ 2.4/2.5 ─ Phase 3
                                └─ (1.3 ใช้ from/to จาก 1.1)
```

- 1.1 และ 1.2 ทำคู่ขนานกันได้ ส่วน 1.3 ทำหลัง 1.1 เพราะต้องเก็บช่วงวันที่ใน URL ด้วย
- Phase 3 เริ่มได้เร็วกว่านี้ ถ้าอยากให้ snapshot ช่วยจับ regression ระหว่างทำ Phase 2

## Dependencies ใหม่ทั้งหมด

| Package | Phase | ไปอยู่ที่ registry item |
|---|---|---|
| react-day-picker, date-fns | 1.1 | `calendar`, `date-picker` |
| react-hook-form, zod, @hookform/resolvers | 1.2 | `form` |
| nuqs | 1.3 | `foundation` |
| @tanstack/react-virtual | 2.2 | `data-table` |
| react-dropzone | 2.4 | `file-dropzone` |
| react-hotkeys-hook | 2.5 | `app-shell` |
| @number-flow/react (ตัวเลือก) | 2.5 | `animated-number` |
| @playwright/test, @axe-core/playwright, eslint-plugin-jsx-a11y | 3 | dev only |

## คำถามที่ต้องตอบก่อนหรือระหว่างทำ
1. ใช้วันอาทิตย์หรือวันจันทร์เป็นวันแรกของสัปดาห์ (ค่าเริ่มต้นที่เสนอ: วันอาทิตย์)
2. ยอมให้ `nuqs` เข้าไปอยู่ใน foundation หรือไม่ (ข้อเสนอ: ยอม)
3. Brand hex และ logo พร้อมเมื่อไร
