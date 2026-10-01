/** Public origin of the deployed gallery/registry (override with NEXT_PUBLIC_SITE_URL, e.g. for previews). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ui.1ecsight.com").replace(/\/$/, "")

export const registryNamespace = "@ecsight"

export const installCommand = (slug: string) => `npx shadcn@latest add ${registryNamespace}/${slug}`

/** What you type after pasting the setup prompt in the overview walkthrough — the actual task */
export const agentFollowUp = `Then build a /customers page with an "add customer" button that opens a form in a Sheet.`

/** A line for the agent's own rules file (CLAUDE.md, AGENTS.md, .cursor/rules) so it keeps following the system */
export const agentRulesLine = `For all UI work, follow ${siteUrl}/design.md. Install components only from the ${registryNamespace} registry (\`npx shadcn@latest add ${registryNamespace}/<name>\`) — never hand-roll components, other icon sets, or native browser controls.`

/** Full, project-agnostic setup prompt for any agent (Claude Code, Cursor, Copilot, …) */
export const agentSetupPrompt = `Set up Ecsight UI in this project.

1. Read ${siteUrl}/design.md and follow it for all UI work in this project.
2. If components.json doesn't exist, run \`npx shadcn@latest init\` first.
3. Add the registry to components.json:
   "registries": { "${registryNamespace}": "${siteUrl}/r/{name}.json" }
4. Install the foundation: \`npx shadcn@latest add ${registryNamespace}/foundation\`
5. In the root layout, set <html lang="th" suppressHydrationWarning> and wrap the app in <Providers> from "@/components/providers".
6. Add this rule to the project's agent rules file (CLAUDE.md, AGENTS.md or .cursor/rules):
   ${agentRulesLine}
7. Run the app, confirm it builds, then tell me what you changed.`
