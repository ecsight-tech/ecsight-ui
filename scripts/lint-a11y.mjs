/**
 * Full eslint-plugin-jsx-a11y "recommended" set, as errors, over app/ and components/.
 * `pnpm lint` only gets the handful of jsx-a11y rules eslint-config-next turns on (as
 * warnings); this is the stricter pass. It lives here rather than in eslint.config.mjs
 * because that file is write-protected by a local hook — fold it into the config when
 * that's lifted, and keep the exceptions below with their reasons.
 */
import { ESLint } from "eslint"
import jsxA11y from "eslint-plugin-jsx-a11y"

const recommended = Object.fromEntries(
  Object.entries(jsxA11y.flatConfigs.recommended.rules).map(([rule, setting]) => [
    rule,
    Array.isArray(setting) ? ["error", ...setting.slice(1)] : setting === "off" || setting === 0 ? "off" : "error",
  ])
)

/** Deliberate exceptions — each one is a pattern the rule can't see is correct. */
const exceptions = [
  {
    // Scrollable region must be keyboard-focusable (axe: scrollable-region-focusable).
    // Spacer rows are aria-hidden padding, not controls.
    files: ["components/blocks/virtual-table.tsx"],
    rules: { "jsx-a11y/no-noninteractive-tabindex": "off", "jsx-a11y/control-has-associated-label": "off" },
  },
  {
    // Calendar inside a popover: focus must land on the grid when it opens (keyboard users).
    files: ["components/ui/date-picker.tsx"],
    rules: { "jsx-a11y/no-autofocus": "off" },
  },
  {
    // Month/year panel (role=dialog) handles Escape to step back without closing the popover.
    files: ["components/ui/calendar.tsx"],
    rules: { "jsx-a11y/no-noninteractive-element-interactions": "off" },
  },
  {
    // shadcn upstream: clicking an addon focuses the input — a mouse convenience; keyboard
    // users reach the input directly.
    files: ["components/ui/input-group.tsx"],
    rules: { "jsx-a11y/click-events-have-key-events": "off", "jsx-a11y/no-noninteractive-element-interactions": "off" },
  },
]

const eslint = new ESLint({
  overrideConfig: [{ files: ["**/*.tsx", "**/*.jsx"], rules: recommended }, ...exceptions],
})
const results = await eslint.lintFiles(["app/**/*.tsx", "components/**/*.tsx"])
const a11y = results
  .map((r) => ({ ...r, messages: r.messages.filter((m) => m.ruleId?.startsWith("jsx-a11y/")) }))
  .filter((r) => r.messages.length)
const formatter = await eslint.loadFormatter("stylish")
const output = await formatter.format(a11y)
if (output) console.log(output)
const errors = a11y.reduce((n, r) => n + r.messages.filter((m) => m.severity === 2).length, 0)
console.log(errors ? `jsx-a11y: ${errors} error(s)` : "jsx-a11y: clean")
process.exit(errors ? 1 : 0)
