import { siClaude, siCursor, siGithubcopilot, siGooglegemini, siV0, siWindsurf, type SimpleIcon } from "simple-icons"
import { cn } from "cn"

import { agentRulesLine, agentSetupPrompt } from "@/lib/site"
import { CopyButton } from "@/components/gallery/copy-button"

// Brand marks + colours from simple-icons (CC0). Near-black marks switch to the foreground in dark mode.
const agents: { icon: SimpleIcon; name: string }[] = [
  { icon: siClaude, name: "Claude Code" },
  { icon: siCursor, name: "Cursor" },
  { icon: siGithubcopilot, name: "GitHub Copilot" },
  { icon: siGooglegemini, name: "Gemini CLI" },
  { icon: siWindsurf, name: "Windsurf" },
  { icon: siV0, name: "v0" },
]

const isDark = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.15
}

/** Overview "Setup prompt": works with any agent, the prompt to paste, and the line that keeps it on the rules */
export function AgentSetup() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <p className="text-sm text-muted-foreground">ใช้ได้กับ AI agent ทุกตัวที่อ่านไฟล์และรันคำสั่งได้</p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {agents.map(({ icon, name }) => (
            <li key={name} className="flex items-center gap-2 text-sm font-medium">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className={cn("size-5 fill-current", isDark(icon.hex) && "dark:text-foreground")}
                style={isDark(icon.hex) ? undefined : { color: `#${icon.hex}` }}
              >
                <path d={icon.path} />
              </svg>
              {name}
            </li>
          ))}
          <li className="text-sm text-muted-foreground">และตัวอื่น ๆ</li>
        </ul>
      </div>

      <div className="grid gap-4">
        <PromptCard
          step="1"
          title="วาง setup prompt"
          hint="ใน agent ที่เปิดอยู่ในโปรเจกต์ของคุณ — ใช้ได้ทั้งโปรเจกต์ใหม่และโปรเจกต์เดิม"
          text={agentSetupPrompt}
        />
        <PromptCard
          step="2"
          title="ให้ agent จำกติกาไว้ใช้ทุกครั้ง"
          hint="setup prompt จะเพิ่มบรรทัดนี้ให้เอง — หรือวางเองใน CLAUDE.md, AGENTS.md หรือ .cursor/rules"
          text={agentRulesLine}
        />
      </div>
    </div>
  )
}

function PromptCard({ step, title, hint, text }: { step: string; title: string; hint: string; text: string }) {
  return (
    <div className="grid content-start gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground tabular-nums">
          {step}
        </span>
        <div className="grid gap-0.5">
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="relative rounded-lg bg-muted/50">
        <pre className="p-3 pr-11 font-mono text-xs leading-relaxed whitespace-pre-wrap">{text}</pre>
        <CopyButton value={text} className="absolute top-1.5 right-1.5" />
      </div>
    </div>
  )
}
