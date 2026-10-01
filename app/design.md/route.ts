import { readFile } from "node:fs/promises"
import path from "node:path"

/**
 * Serves the rules file at /design.md so an AI agent in any project can read it
 * ("ติดตั้ง Ecsight UI ตามกติกาใน <site>/design.md …"). Built once, static.
 */
export const dynamic = "force-static"

export async function GET() {
  const body = await readFile(path.join(process.cwd(), "design.md"), "utf8")
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
