// ─── Types ────────────────────────────────────────────────────────────────────

export type DailyMetric = {
  date: string // "yyyy-MM-dd"
  revenue: number
  orders: number
  newCustomers: number
  churnedCustomers: number
}

export type TrafficSource = {
  source: string // "Search", "Direct", "Social", "Referral", "Email"
  sessions: number
  percentage: number
}

export type DayOfWeekMetric = {
  day: string // "Mon", "Tue", etc.
  orders: number
}

// ─── Static mock data ─────────────────────────────────────────────────────────

export const dailyMetrics: DailyMetric[] = [
  {
    date: "2026-07-20",
    revenue: 1200,
    orders: 15,
    newCustomers: 5,
    churnedCustomers: 1,
  },
  {
    date: "2026-07-21",
    revenue: 1450,
    orders: 18,
    newCustomers: 6,
    churnedCustomers: 2,
  },
  {
    date: "2026-07-22",
    revenue: 980,
    orders: 12,
    newCustomers: 4,
    churnedCustomers: 0,
  },
  {
    date: "2026-07-23",
    revenue: 1850,
    orders: 22,
    newCustomers: 8,
    churnedCustomers: 3,
  },
  {
    date: "2026-07-24",
    revenue: 2100,
    orders: 25,
    newCustomers: 9,
    churnedCustomers: 1,
  },
  {
    date: "2026-07-25",
    revenue: 1600,
    orders: 20,
    newCustomers: 4,
    churnedCustomers: 2,
  },
  {
    date: "2026-07-26",
    revenue: 1100,
    orders: 14,
    newCustomers: 3,
    churnedCustomers: 0,
  },
  {
    date: "2026-07-27",
    revenue: 1300,
    orders: 16,
    newCustomers: 6,
    churnedCustomers: 1,
  },
  {
    date: "2026-07-28",
    revenue: 1750,
    orders: 21,
    newCustomers: 7,
    churnedCustomers: 2,
  },
  {
    date: "2026-07-29",
    revenue: 1900,
    orders: 24,
    newCustomers: 8,
    churnedCustomers: 1,
  },
  {
    date: "2026-07-30",
    revenue: 2200,
    orders: 28,
    newCustomers: 10,
    churnedCustomers: 3,
  },
  {
    date: "2026-07-31",
    revenue: 2500,
    orders: 30,
    newCustomers: 11,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-01",
    revenue: 1950,
    orders: 23,
    newCustomers: 5,
    churnedCustomers: 1,
  },
  {
    date: "2026-08-02",
    revenue: 1400,
    orders: 17,
    newCustomers: 4,
    churnedCustomers: 0,
  },
  {
    date: "2026-08-03",
    revenue: 1650,
    orders: 20,
    newCustomers: 7,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-04",
    revenue: 1800,
    orders: 22,
    newCustomers: 8,
    churnedCustomers: 1,
  },
  {
    date: "2026-08-05",
    revenue: 2100,
    orders: 26,
    newCustomers: 9,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-06",
    revenue: 2300,
    orders: 29,
    newCustomers: 10,
    churnedCustomers: 3,
  },
  {
    date: "2026-08-07",
    revenue: 2650,
    orders: 32,
    newCustomers: 12,
    churnedCustomers: 1,
  },
  {
    date: "2026-08-08",
    revenue: 2100,
    orders: 25,
    newCustomers: 6,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-09",
    revenue: 1550,
    orders: 19,
    newCustomers: 5,
    churnedCustomers: 0,
  },
  {
    date: "2026-08-10",
    revenue: 1700,
    orders: 21,
    newCustomers: 7,
    churnedCustomers: 1,
  },
  {
    date: "2026-08-11",
    revenue: 1950,
    orders: 24,
    newCustomers: 8,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-12",
    revenue: 2250,
    orders: 27,
    newCustomers: 10,
    churnedCustomers: 1,
  },
  {
    date: "2026-08-13",
    revenue: 2400,
    orders: 30,
    newCustomers: 11,
    churnedCustomers: 3,
  },
  {
    date: "2026-08-14",
    revenue: 2700,
    orders: 33,
    newCustomers: 13,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-15",
    revenue: 2200,
    orders: 26,
    newCustomers: 7,
    churnedCustomers: 1,
  },
  {
    date: "2026-08-16",
    revenue: 1750,
    orders: 22,
    newCustomers: 5,
    churnedCustomers: 0,
  },
  {
    date: "2026-08-17",
    revenue: 1900,
    orders: 23,
    newCustomers: 8,
    churnedCustomers: 2,
  },
  {
    date: "2026-08-18",
    revenue: 2350,
    orders: 28,
    newCustomers: 9,
    churnedCustomers: 1,
  },
]

export const trafficSources: TrafficSource[] = [
  { source: "Search Engines", sessions: 24500, percentage: 45 },
  { source: "Direct Traffic", sessions: 13600, percentage: 25 },
  { source: "Social Media", sessions: 8100, percentage: 15 },
  { source: "Referral Links", sessions: 5400, percentage: 10 },
  { source: "Email Campaigns", sessions: 2700, percentage: 5 },
]

export const weeklyOrders: DayOfWeekMetric[] = [
  { day: "Mon", orders: 165 },
  { day: "Tue", orders: 182 },
  { day: "Wed", orders: 195 },
  { day: "Thu", orders: 210 },
  { day: "Fri", orders: 245 },
  { day: "Sat", orders: 180 },
  { day: "Sun", orders: 150 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeAnalyticsSummary(metrics: DailyMetric[]) {
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0)
  const totalOrders = metrics.reduce((sum, m) => sum + m.orders, 0)
  const totalNewCustomers = metrics.reduce((sum, m) => sum + m.newCustomers, 0)
  const totalChurned = metrics.reduce((sum, m) => sum + m.churnedCustomers, 0)

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const netCustomerGrowth = totalNewCustomers - totalChurned

  return {
    totalRevenue,
    totalOrders,
    totalNewCustomers,
    avgOrderValue,
    netCustomerGrowth,
  }
}
