import "server-only"

import fs from "node:fs/promises"
import path from "node:path"

/**
 * Reads a repo file for display in the gallery. Paths are repo-relative and come from lib/catalog.ts only.
 * Every caller is statically generated at build time, so the server bundle doesn't need these files traced.
 */
export async function readSource(file: string) {
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), file)
  if (!abs.startsWith(process.cwd() + path.sep)) throw new Error(`Refusing to read outside repo: ${file}`)
  return fs.readFile(abs, "utf8")
}

/** Extracts the text between `// #region <name>` and the next `// #endregion`. */
export async function readRegion(file: string, name: string) {
  const src = await readSource(file)
  const match = src.match(new RegExp(`// #region ${name}\\n([\\s\\S]*?)// #endregion`))
  return match?.[1].trimEnd() ?? null
}
