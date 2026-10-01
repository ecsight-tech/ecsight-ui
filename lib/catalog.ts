/**
 * Single source of truth for what the Ecsight registry ships.
 * Read by the gallery (nav, pages) and scripts/build-registry.ts.
 * Pure data — no React imports — so Node can load it directly.
 */

export type CatalogItem = {
  slug: string
  title: string
  description: string
  /** Files relative to repo root that make up the registry item */
  files: string[]
  /** How this component moves — shown in the gallery and design.md */
  motion?: string
  /** Custom to Ecsight (not in upstream shadcn) */
  custom?: boolean
}

export const components: CatalogItem[] = [
  { slug: "button", title: "Button", description: "Actions. One primary per view.", files: ["components/ui/button.tsx"], motion: "Scales to 0.97 on press. `loading` keeps colour and width, spinner overlays the label." },
  { slug: "input", title: "Input", description: "Single-line text field. Pair with Label above.", files: ["components/ui/input.tsx"] },
  { slug: "input-group", title: "Input Group", description: "Input with icon, text or button addons.", files: ["components/ui/input-group.tsx"] },
  { slug: "textarea", title: "Textarea", description: "Multi-line text field.", files: ["components/ui/textarea.tsx"] },
  { slug: "field", title: "Field", description: "Label + control + description + error, with validation state.", files: ["components/ui/field.tsx"], motion: "Errors slide open (height + fade); invalid field shakes once." },
  { slug: "form", title: "Form", description: "react-hook-form + zod wired into Field; Thai validators in lib/validation.", files: ["components/ui/form.tsx", "lib/validation.ts"], motion: "Errors slide open; a field shakes once when it turns invalid; focus jumps to the first error.", custom: true },
  { slug: "calendar", title: "Calendar", description: "Month grid — พ.ศ. by default, Sunday-first, Arabic digits. Click the caption for a month/year grid; วันนี้ jumps back.", files: ["components/ui/calendar.tsx"], motion: "Months slide in from the side they come from (260ms ease-out); the month/year panel fades in." },
  { slug: "date-picker", title: "Date Picker", description: "Typeable DateInput, DatePicker and DateRangePicker (presets incl. ปีงบประมาณ, hover preview, max span).", files: ["components/ui/date-picker.tsx", "lib/format.ts"], motion: "Popover springs in; the range closes itself once both ends are picked.", custom: true },
  { slug: "label", title: "Label", description: "Accessible label for form controls.", files: ["components/ui/label.tsx"] },
  { slug: "select", title: "Select", description: "Pick one option from a short list (≤ 12).", files: ["components/ui/select.tsx"], motion: "Content pops in on the spring curve." },
  { slug: "combobox", title: "Combobox", description: "Searchable select built from Popover + Command.", files: ["components/ui/command.tsx", "components/ui/popover.tsx"], motion: "Popover springs in; list filters instantly." },
  { slug: "checkbox", title: "Checkbox", description: "Independent on/off choices, multi-select.", files: ["components/ui/checkbox.tsx"], motion: "Checkmark zooms in with a spring overshoot." },
  { slug: "switch", title: "Switch", description: "Settings that apply immediately.", files: ["components/ui/switch.tsx"], motion: "Thumb slides on the spring curve." },
  { slug: "radio-group", title: "Radio Group", description: "One choice from 2–5 visible options.", files: ["components/ui/radio-group.tsx"] },
  { slug: "toggle-group", title: "Toggle Group", description: "Segmented control for views and ranges.", files: ["components/ui/toggle-group.tsx", "components/ui/toggle.tsx"], motion: "Selected item indicator glides between options (type=\"single\")." },
  { slug: "dialog", title: "Dialog", description: "Blocking confirmation or short focused task.", files: ["components/ui/dialog.tsx"], motion: "Zoom + fade in on spring; exits fast (120ms ease-in)." },
  { slug: "sheet", title: "Sheet", description: "Side panel for create/edit forms and details.", files: ["components/ui/sheet.tsx"], motion: "Slides from the edge, ease-out 260ms (no overshoot at edges)." },
  { slug: "dropdown-menu", title: "Dropdown Menu", description: "Contextual actions behind a trigger.", files: ["components/ui/dropdown-menu.tsx"], motion: "Springs in from the trigger side." },
  { slug: "popover", title: "Popover", description: "Non-blocking floating content.", files: ["components/ui/popover.tsx"], motion: "Springs in from the trigger side." },
  { slug: "tooltip", title: "Tooltip", description: "Short label for icon-only controls.", files: ["components/ui/tooltip.tsx"], motion: "300ms delay, springs in." },
  { slug: "tabs", title: "Tabs", description: "Switch between peer views in one context.", files: ["components/ui/tabs.tsx"], motion: "Active pill / underline glides between tabs (layoutId, snappy spring)." },
  { slug: "accordion", title: "Accordion", description: "Collapsible sections — FAQs, advanced settings.", files: ["components/ui/accordion.tsx"], motion: "Height eases open 260ms (no overshoot); arrow rotates." },
  { slug: "card", title: "Card", description: "Groups related content and actions.", files: ["components/ui/card.tsx"] },
  { slug: "badge", title: "Badge", description: "Status and counts.", files: ["components/ui/badge.tsx"] },
  { slug: "avatar", title: "Avatar", description: "Person or organisation; Thai initials supported.", files: ["components/ui/avatar.tsx"] },
  { slug: "table", title: "Table", description: "Tabular data with tabular numbers.", files: ["components/ui/table.tsx"] },
  { slug: "breadcrumb", title: "Breadcrumb", description: "Location within the app hierarchy.", files: ["components/ui/breadcrumb.tsx"] },
  { slug: "toast", title: "Toast (Sonner)", description: "Async feedback after an action.", files: ["components/ui/sonner.tsx"], motion: "Sonner stack animation; Solar status icons." },
  { slug: "alert", title: "Alert", description: "Inline, persistent message in the page.", files: ["components/ui/alert.tsx"] },
  { slug: "progress", title: "Progress", description: "Determinate progress toward a goal.", files: ["components/ui/progress.tsx"], motion: "Fills with ease-out over 700ms." },
  { slug: "skeleton", title: "Skeleton", description: "Placeholder while content loads (> 300ms).", files: ["components/ui/skeleton.tsx"], motion: "Gentle pulse." },
  { slug: "separator", title: "Separator", description: "Visual divider.", files: ["components/ui/separator.tsx"] },
  { slug: "chart", title: "Chart", description: "Recharts wrapper themed with --chart-* tokens.", files: ["components/ui/chart.tsx"], motion: "Series draw in 600ms ease-out." },
  { slug: "sidebar", title: "Sidebar", description: "App navigation; see the App Shell block.", files: ["components/ui/sidebar.tsx"] },
  { slug: "icon", title: "Icon", description: "Solar icon with animated Linear → Bold swap for state.", files: ["components/ui/icon.tsx"], motion: "Swap: scale + rotate on a bouncy spring.", custom: true },
  { slug: "logo", title: "Logo", description: "Ecsight mark (#0056FF) and mark + wordmark lockup.", files: ["components/ui/logo.tsx"], custom: true },
  { slug: "kbd", title: "Kbd", description: "Keyboard keys and shortcuts (⌘K, G แล้ว O).", files: ["components/ui/kbd.tsx"], custom: true },
  { slug: "status-badge", title: "Status Badge", description: "Record status: dot + label, 5 tones; `live` pulses for in-progress states.", files: ["components/ui/status-badge.tsx"], motion: "`live` dot pings (off with reduced motion).", custom: true },
  { slug: "multi-select", title: "Multi Select", description: "Pick several values; chips in the trigger, search, groups, select all / clear.", files: ["components/ui/multi-select.tsx"], motion: "Chips pop in/out and reflow (layout).", custom: true },
  { slug: "file-dropzone", title: "File Dropzone", description: "Drag/drop/paste upload with per-file progress, errors, retry and rejection reasons.", files: ["components/ui/file-dropzone.tsx"], motion: "Icon lifts on drag-over; rows slide in.", custom: true },
  { slug: "stepper", title: "Stepper", description: "Progress through a multi-step flow; jump back to completed steps.", files: ["components/ui/stepper.tsx"], motion: "Connector fills on a spring; check pops in.", custom: true },
  { slug: "timeline", title: "Timeline", description: "Activity feed / order history with relative Thai time.", files: ["components/ui/timeline.tsx"], motion: "Items stagger in.", custom: true },
  { slug: "spinner", title: "Spinner", description: "Indeterminate loading inside buttons and toasts.", files: ["components/ui/spinner.tsx"], custom: true },
  { slug: "animated-number", title: "Animated Number", description: "KPI value that counts up when it enters view.", files: ["components/ui/animated-number.tsx"], motion: "900ms ease-out tween — never overshoots.", custom: true },
  { slug: "count-badge", title: "Count Badge", description: "Unread / cart counts on icons.", files: ["components/ui/count-badge.tsx"], motion: "Pops in/out on a bouncy spring; digits roll in the direction of change.", custom: true },
  { slug: "empty-state", title: "Empty State", description: "Nothing to show — explain why and offer a next step.", files: ["components/ui/empty-state.tsx"], motion: "Icon, title, text, action stagger in.", custom: true },
]

export const blocks: CatalogItem[] = [
  { slug: "app-shell", title: "App Shell", description: "Sidebar + top bar frame with ⌘K, theme toggle, account menu.", files: ["components/blocks/app-shell.tsx"], motion: "Active nav pill glides (layoutId) and icon swaps Linear → Bold." },
  { slug: "kpi-cards", title: "KPI Cards", description: "Row of metric cards with trend.", files: ["components/blocks/kpi-cards.tsx"], motion: "Cards stagger in; numbers count up." },
  { slug: "revenue-chart", title: "Revenue Chart", description: "Stacked area chart with range switcher.", files: ["components/blocks/revenue-chart.tsx"] },
  { slug: "orders-table", title: "Data Table", description: "Search, faceted filters with counts, sort, show/hide columns, bulk-action bar, pagination — view state in the URL.", files: ["components/blocks/orders-table.tsx", "components/blocks/data-table/data-table-faceted-filter.tsx", "components/blocks/data-table/data-table-view-options.tsx", "components/blocks/data-table/data-table-pagination.tsx", "components/blocks/data-table/data-table-bulk-bar.tsx", "lib/demo-data.ts"], motion: "Rows animate in/out with layout transitions." },
  { slug: "virtual-table", title: "Virtual Table", description: "10,000 rows, sticky header, sort — only visible rows render.", files: ["components/blocks/virtual-table.tsx", "lib/demo-data.ts"], motion: "None on rows by design — animation fights virtualization." },
  { slug: "customer-sheet", title: "Form in Sheet", description: "Create form pattern with pending state and toast.", files: ["components/blocks/customer-sheet.tsx"] },
  { slug: "login-form", title: "Login", description: "Sign-in card with password reveal.", files: ["components/blocks/login-form.tsx"], motion: "Fields stagger in; eye icon swaps." },
]
