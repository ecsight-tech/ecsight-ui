import { z } from "zod"

/**
 * Shared zod schemas with Thai messages. Anything not covered here falls back
 * to zod's built-in Thai locale.
 */
z.config(z.locales.th())

/** Required text, trimmed. `required("ชื่อลูกค้า")` → "กรุณากรอกชื่อลูกค้า" */
export const required = (label: string) => z.string().trim().min(1, `กรุณากรอก${label}`)

export const email = z
  .string()
  .trim()
  .min(1, "กรุณากรอกอีเมล")
  .pipe(z.email("รูปแบบอีเมลไม่ถูกต้อง"))

/** Thai mobile number. Accepts 081-234-5678, 081 234 5678 or 0812345678; outputs digits only. */
export const thaiMobile = z
  .string()
  .trim()
  .min(1, "กรุณากรอกเบอร์มือถือ")
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^0[689]\d{8}$/, "เบอร์มือถือต้องขึ้นต้นด้วย 06, 08 หรือ 09 และมี 10 หลัก"))

/** True when a 13-digit Thai national/tax ID passes its mod-11 check digit */
export function isValidThaiId(id: string) {
  if (!/^\d{13}$/.test(id)) return false
  const sum = [...id.slice(0, 12)].reduce((acc, d, i) => acc + Number(d) * (13 - i), 0)
  return (11 - (sum % 11)) % 10 === Number(id[12])
}

/** เลขประจำตัวผู้เสียภาษี 13 หลัก (เลขบัตรประชาชนหรือนิติบุคคล). Dashes/spaces allowed; outputs digits only. */
export const thaiTaxId = z
  .string()
  .trim()
  .min(1, "กรุณากรอกเลขประจำตัวผู้เสียภาษี")
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(
    z
      .string()
      .regex(/^\d{13}$/, "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก")
      .refine(isValidThaiId, "เลขประจำตัวผู้เสียภาษีไม่ถูกต้อง (ตรวจสอบหลักสุดท้าย)")
  )

/** Wrap a string schema so an empty input becomes `undefined` — for optional fields */
export const optional = <T extends z.ZodType<unknown, string>>(schema: T) =>
  z
    .string()
    .transform((v) => (v.trim() === "" ? undefined : v))
    .pipe(schema.optional())
