/** Synthetic sample data for the /demo dashboard and gallery previews. Not real customers. */

export type OrderStatus = "paid" | "pending" | "shipped" | "refunded"

export type Order = {
  id: string
  customer: string
  email: string
  status: OrderStatus
  channel: "Web" | "LINE OA" | "Shopee" | "Lazada"
  amount: number
  date: string // ISO 8601, e.g. "2026-09-28"
}

const customers = [
  ["สมชาย ใจดี", "somchai@example.com"],
  ["Nattaya K.", "nattaya@example.com"],
  ["บริษัท ทองไทย จำกัด", "billing@thongthai.example"],
  ["Pimchanok S.", "pim@example.com"],
  ["วิภาวดี รุ่งเรือง", "wipa@example.com"],
  ["Ekkachai P.", "ekkachai@example.com"],
  ["ร้านกาแฟดอยสูง", "hello@doisoong.example"],
  ["Thanakorn W.", "thanakorn@example.com"],
  ["มาลี ศรีสุข", "malee@example.com"],
  ["Kittipong L.", "kittipong@example.com"],
  ["สุดารัตน์ แสงทอง", "sudarat@example.com"],
  ["Arunee C.", "arunee@example.com"],
] as const

const statuses: OrderStatus[] = ["paid", "paid", "shipped", "pending", "paid", "refunded", "shipped", "paid"]
const channels: Order["channel"][] = ["Web", "LINE OA", "Shopee", "Lazada"]

/** The data "ends" here; demo date presets are relative to it so they always have rows. */
export const DEMO_TODAY = new Date(2026, 8, 30)

/** Local YYYY-MM-DD, `n` days before DEMO_TODAY */
function daysAgo(n: number) {
  const d = new Date(DEMO_TODAY)
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export const orders: Order[] = Array.from({ length: 60 }, (_, i) => {
  const [customer, email] = customers[i % customers.length]
  return {
    id: `ORD-${24081 + i * 7}`,
    customer,
    email,
    status: statuses[(i * 3) % statuses.length],
    channel: channels[(i * 5) % channels.length],
    amount: Math.round((((i * 7919) % 9000) + 350) / 10) * 10,
    date: daysAgo((i * 3) % 89),
  }
})

/** Deterministic bulk sample (e.g. 10,000 rows for the virtualized table) — same shape as `orders` */
export function makeOrders(count: number): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const [customer, email] = customers[(i * 7) % customers.length]
    return {
      id: `ORD-${String(100001 + i)}`,
      customer,
      email,
      status: statuses[(i * 5) % statuses.length],
      channel: channels[(i * 3) % channels.length],
      amount: Math.round((((i * 7919) % 12000) + 120) / 10) * 10,
      date: daysAgo((i * 13) % 365),
    }
  })
}

export const statusLabel: Record<OrderStatus, string> = {
  paid: "ชำระแล้ว",
  pending: "รอชำระ",
  shipped: "จัดส่งแล้ว",
  refunded: "คืนเงิน",
}

export const kpis = [
  { key: "revenue", label: "รายได้เดือนนี้", value: 1284500, delta: 12.4, format: { style: "currency", currency: "THB", maximumFractionDigits: 0 }, trend: [38, 41, 39, 44, 47, 45, 52, 55, 53, 58, 61, 64] },
  { key: "orders", label: "คำสั่งซื้อ", value: 3421, delta: 8.1, format: {}, trend: [210, 230, 225, 260, 255, 270, 290, 285, 300, 310, 305, 330] },
  { key: "customers", label: "ลูกค้าใหม่", value: 482, delta: -3.2, format: {}, trend: [52, 49, 51, 47, 45, 46, 43, 44, 41, 42, 40, 39] },
  { key: "aov", label: "ยอดเฉลี่ยต่อออเดอร์", value: 375.4, delta: 4.6, format: { style: "currency", currency: "THB", maximumFractionDigits: 0 }, trend: [350, 355, 352, 360, 358, 362, 365, 361, 368, 370, 372, 375] },
] as const satisfies ReadonlyArray<{ key: string; label: string; value: number; delta: number; format: Intl.NumberFormatOptions; trend: readonly number[] }>

export const revenueSeries = Array.from({ length: 90 }, (_, i) => {
  const base = 32000 + Math.sin(i / 3) * 6000 + i * 140
  return {
    date: daysAgo(89 - i),
    web: Math.round(base * 0.55),
    marketplace: Math.round(base * 0.45 + Math.cos(i / 2) * 2500),
  }
})
