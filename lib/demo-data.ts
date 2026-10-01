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

export const statusLabel: Record<OrderStatus, string> = {
  paid: "ชำระแล้ว",
  pending: "รอชำระ",
  shipped: "จัดส่งแล้ว",
  refunded: "คืนเงิน",
}

export const kpis = [
  { key: "revenue", label: "รายได้เดือนนี้", value: 1284500, delta: 12.4, format: { style: "currency", currency: "THB", maximumFractionDigits: 0 } },
  { key: "orders", label: "คำสั่งซื้อ", value: 3421, delta: 8.1, format: {} },
  { key: "customers", label: "ลูกค้าใหม่", value: 482, delta: -3.2, format: {} },
  { key: "aov", label: "ยอดเฉลี่ยต่อออเดอร์", value: 375.4, delta: 4.6, format: { style: "currency", currency: "THB", maximumFractionDigits: 0 } },
] as const satisfies ReadonlyArray<{ key: string; label: string; value: number; delta: number; format: Intl.NumberFormatOptions }>

export const revenueSeries = Array.from({ length: 90 }, (_, i) => {
  const base = 32000 + Math.sin(i / 3) * 6000 + i * 140
  return {
    date: daysAgo(89 - i),
    web: Math.round(base * 0.55),
    marketplace: Math.round(base * 0.45 + Math.cos(i / 2) * 2500),
  }
})
