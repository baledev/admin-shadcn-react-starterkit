export type IncomeStatementSection = {
  id: string
  name: string
  amount: number
  type: "revenue" | "expense" | "total" | "net"
  children?: IncomeStatementSection[]
}

export interface IncomeStatementData {
  period: string
  revenue: number
  expense: number
  netProfit: number
  margin: number
  details: IncomeStatementSection[]
}

export interface MonthlyIncomeTrend {
  year: number
  month: number // 1-12
  monthName: string
  revenue: number
  expense: number
  netProfit: number
}

export const monthlyIncomeTrendData: MonthlyIncomeTrend[] = [
  // 2024
  {
    year: 2024,
    month: 1,
    monthName: "Jan",
    revenue: 170000000,
    expense: 110000000,
    netProfit: 60000000,
  },
  {
    year: 2024,
    month: 2,
    monthName: "Feb",
    revenue: 175000000,
    expense: 115000000,
    netProfit: 60000000,
  },
  {
    year: 2024,
    month: 3,
    monthName: "Mar",
    revenue: 180000000,
    expense: 120000000,
    netProfit: 60000000,
  },
  {
    year: 2024,
    month: 4,
    monthName: "Apr",
    revenue: 185000000,
    expense: 122000000,
    netProfit: 63000000,
  },
  {
    year: 2024,
    month: 5,
    monthName: "Mei",
    revenue: 190000000,
    expense: 125000000,
    netProfit: 65000000,
  },
  {
    year: 2024,
    month: 6,
    monthName: "Jun",
    revenue: 195000000,
    expense: 130000000,
    netProfit: 65000000,
  },
  {
    year: 2024,
    month: 7,
    monthName: "Jul",
    revenue: 200000000,
    expense: 132000000,
    netProfit: 68000000,
  },
  {
    year: 2024,
    month: 8,
    monthName: "Agt",
    revenue: 205000000,
    expense: 135000000,
    netProfit: 70000000,
  },
  {
    year: 2024,
    month: 9,
    monthName: "Sep",
    revenue: 210000000,
    expense: 138000000,
    netProfit: 72000000,
  },
  {
    year: 2024,
    month: 1,
    monthName: "Okt",
    revenue: 215000000,
    expense: 140000000,
    netProfit: 75000000,
  },
  {
    year: 2024,
    month: 11,
    monthName: "Nov",
    revenue: 220000000,
    expense: 142000000,
    netProfit: 78000000,
  },
  {
    year: 2024,
    month: 12,
    monthName: "Des",
    revenue: 230000000,
    expense: 145000000,
    netProfit: 85000000,
  },

  // 2025
  {
    year: 2025,
    month: 1,
    monthName: "Jan",
    revenue: 210000000,
    expense: 135000000,
    netProfit: 75000000,
  },
  {
    year: 2025,
    month: 2,
    monthName: "Feb",
    revenue: 215000000,
    expense: 138000000,
    netProfit: 77000000,
  },
  {
    year: 2025,
    month: 3,
    monthName: "Mar",
    revenue: 220000000,
    expense: 140000000,
    netProfit: 80000000,
  },
  {
    year: 2025,
    month: 4,
    monthName: "Apr",
    revenue: 225000000,
    expense: 142000000,
    netProfit: 83000000,
  },
  {
    year: 2025,
    month: 5,
    monthName: "Mei",
    revenue: 230000000,
    expense: 145000000,
    netProfit: 85000000,
  },
  {
    year: 2025,
    month: 6,
    monthName: "Jun",
    revenue: 235000000,
    expense: 148000000,
    netProfit: 87000000,
  },
  {
    year: 2025,
    month: 7,
    monthName: "Jul",
    revenue: 240000000,
    expense: 150000000,
    netProfit: 90000000,
  },
  {
    year: 2025,
    month: 8,
    monthName: "Agt",
    revenue: 245000000,
    expense: 152000000,
    netProfit: 93000000,
  },
  {
    year: 2025,
    month: 9,
    monthName: "Sep",
    revenue: 250000000,
    expense: 155000000,
    netProfit: 95000000,
  },
  {
    year: 2025,
    month: 10,
    monthName: "Okt",
    revenue: 255000000,
    expense: 158000000,
    netProfit: 97000000,
  },
  {
    year: 2025,
    month: 11,
    monthName: "Nov",
    revenue: 260000000,
    expense: 160000000,
    netProfit: 100000000,
  },
  {
    year: 2025,
    month: 12,
    monthName: "Des",
    revenue: 275000000,
    expense: 165000000,
    netProfit: 110000000,
  },

  // 2026
  {
    year: 2026,
    month: 1,
    monthName: "Jan",
    revenue: 240000000,
    expense: 150000000,
    netProfit: 90000000,
  },
  {
    year: 2026,
    month: 2,
    monthName: "Feb",
    revenue: 242000000,
    expense: 152000000,
    netProfit: 90000000,
  },
  {
    year: 2026,
    month: 3,
    monthName: "Mar",
    revenue: 245000000,
    expense: 153000000,
    netProfit: 92000000,
  },
  {
    year: 2026,
    month: 4,
    monthName: "Apr",
    revenue: 248000000,
    expense: 154000000,
    netProfit: 94000000,
  },
  {
    year: 2026,
    month: 5,
    monthName: "Mei",
    revenue: 250000000,
    expense: 155000000,
    netProfit: 95000000,
  },
  {
    year: 2026,
    month: 6,
    monthName: "Jun",
    revenue: 252000000,
    expense: 156000000,
    netProfit: 96000000,
  },
  {
    year: 2026,
    month: 7,
    monthName: "Jul",
    revenue: 248000000,
    expense: 152000000,
    netProfit: 96000000,
  },
  {
    year: 2026,
    month: 8,
    monthName: "Agt",
    revenue: 250000000,
    expense: 145000000,
    netProfit: 105000000,
  },
  {
    year: 2026,
    month: 9,
    monthName: "Sep",
    revenue: 258000000,
    expense: 150000000,
    netProfit: 108000000,
  },
  {
    year: 2026,
    month: 10,
    monthName: "Okt",
    revenue: 262000000,
    expense: 153000000,
    netProfit: 109000000,
  },
  {
    year: 2026,
    month: 11,
    monthName: "Nov",
    revenue: 268000000,
    expense: 155000000,
    netProfit: 113000000,
  },
  {
    year: 2026,
    month: 12,
    monthName: "Des",
    revenue: 280000000,
    expense: 160000000,
    netProfit: 120000000,
  },
]

export const initialIncomeStatement: IncomeStatementData = {
  period: "2026-08",
  revenue: 250000000,
  expense: 145000000,
  netProfit: 105000000,
  margin: 42,
  details: [
    {
      id: "rev-1",
      name: "Pendapatan Usaha (Revenue)",
      amount: 250000000,
      type: "revenue",
      children: [
        {
          id: "rev-1-1",
          name: "Penjualan Produk",
          amount: 180000000,
          type: "revenue",
        },
        {
          id: "rev-1-2",
          name: "Pendapatan Jasa & Layanan",
          amount: 70000000,
          type: "revenue",
        },
      ],
    },
    {
      id: "exp-1",
      name: "Harga Pokok Penjualan (HPP / COGS)",
      amount: 80000000,
      type: "expense",
      children: [
        {
          id: "exp-1-1",
          name: "Pembelian Bahan Baku",
          amount: 55000000,
          type: "expense",
        },
        {
          id: "exp-1-2",
          name: "Biaya Logistik & Pengiriman",
          amount: 25000000,
          type: "expense",
        },
      ],
    },
    {
      id: "exp-2",
      name: "Beban Operasional (OPEX)",
      amount: 65000000,
      type: "expense",
      children: [
        {
          id: "exp-2-1",
          name: "Gaji & Kesejahteraan Karyawan",
          amount: 45000000,
          type: "expense",
        },
        {
          id: "exp-2-2",
          name: "Sewa Tempat & Utilitas",
          amount: 12000000,
          type: "expense",
        },
        {
          id: "exp-2-3",
          name: "Pemasaran & Iklan",
          amount: 8000000,
          type: "expense",
        },
      ],
    },
  ],
}

// Generate dynamic details based on revenue and expense percentages
export function generateDetails(
  revenue: number,
  expense: number
): IncomeStatementSection[] {
  const cogs = Math.round(expense * 0.5517) // 80M / 145M ≈ 55.17%
  const opex = expense - cogs // 65M / 145M ≈ 44.83%

  const productSale = Math.round(revenue * 0.72)
  const serviceSale = revenue - productSale

  const rawMaterial = Math.round(cogs * 0.6875)
  const logistics = cogs - rawMaterial

  const salaries = Math.round(opex * 0.6923)
  const rent = Math.round(opex * 0.1846)
  const marketing = opex - salaries - rent

  return [
    {
      id: "rev-1",
      name: "Pendapatan Usaha (Revenue)",
      amount: revenue,
      type: "revenue",
      children: [
        {
          id: "rev-1-1",
          name: "Penjualan Produk",
          amount: productSale,
          type: "revenue",
        },
        {
          id: "rev-1-2",
          name: "Pendapatan Jasa & Layanan",
          amount: serviceSale,
          type: "revenue",
        },
      ],
    },
    {
      id: "exp-1",
      name: "Harga Pokok Penjualan (HPP / COGS)",
      amount: cogs,
      type: "expense",
      children: [
        {
          id: "exp-1-1",
          name: "Pembelian Bahan Baku",
          amount: rawMaterial,
          type: "expense",
        },
        {
          id: "exp-1-2",
          name: "Biaya Logistik & Pengiriman",
          amount: logistics,
          type: "expense",
        },
      ],
    },
    {
      id: "exp-2",
      name: "Beban Operasional (OPEX)",
      amount: opex,
      type: "expense",
      children: [
        {
          id: "exp-2-1",
          name: "Gaji & Kesejahteraan Karyawan",
          amount: salaries,
          type: "expense",
        },
        {
          id: "exp-2-2",
          name: "Sewa Tempat & Utilitas",
          amount: rent,
          type: "expense",
        },
        {
          id: "exp-2-3",
          name: "Pemasaran & Iklan",
          amount: marketing,
          type: "expense",
        },
      ],
    },
  ]
}

export interface ChartDataPoint {
  label: string
  revenue: number
  expense: number
  netProfit: number
}

// Compute trend data based on selected year, month range or custom filters
export function getChartData(
  selectedYear: number,
  granularity: "weekly" | "monthly" | "quarterly" | "yearly",
  dateRange?: { from?: Date; to?: Date }
): ChartDataPoint[] {
  const filteredYearData = monthlyIncomeTrendData.filter(
    (item) => item.year === selectedYear
  )

  if (granularity === "yearly") {
    // Group all data by year
    const years = [2024, 2025, 2026]
    return years.map((y) => {
      const yearData = monthlyIncomeTrendData.filter((item) => item.year === y)
      const revenue = yearData.reduce((sum, item) => sum + item.revenue, 0)
      const expense = yearData.reduce((sum, item) => sum + item.expense, 0)
      const netProfit = revenue - expense
      return {
        label: y.toString(),
        revenue,
        expense,
        netProfit,
      }
    })
  }

  if (granularity === "quarterly") {
    const quarters = [
      { name: "Kuartal 1 (Q1)", months: [1, 2, 3] },
      { name: "Kuartal 2 (Q2)", months: [4, 5, 6] },
      { name: "Kuartal 3 (Q3)", months: [7, 8, 9] },
      { name: "Kuartal 4 (Q4)", months: [10, 11, 12] },
    ]
    return quarters.map((q) => {
      const qData = filteredYearData.filter((item) =>
        q.months.includes(item.month)
      )
      const revenue = qData.reduce((sum, item) => sum + item.revenue, 0)
      const expense = qData.reduce((sum, item) => sum + item.expense, 0)
      const netProfit = revenue - expense
      return {
        label: q.name,
        revenue,
        expense,
        netProfit,
      }
    })
  }

  if (granularity === "weekly") {
    // If we have a selected month from the dateRange, use it. Otherwise default to August (month 8, 0-indexed is 7)
    let targetMonth = 8 // August
    if (dateRange?.from) {
      targetMonth = dateRange.from.getMonth() + 1
    }
    const monthData = filteredYearData.find(
      (item) => item.month === targetMonth
    ) || {
      year: selectedYear,
      month: targetMonth,
      revenue: 250000000,
      expense: 145000000,
    }

    // Divide the month's total into 4 weeks with some realistic distribution
    const distributions = [
      { week: "Minggu 1", revPct: 0.22, expPct: 0.23 },
      { week: "Minggu 2", revPct: 0.26, expPct: 0.24 },
      { week: "Minggu 3", revPct: 0.24, expPct: 0.25 },
      { week: "Minggu 4", revPct: 0.28, expPct: 0.28 },
    ]

    return distributions.map((d) => {
      const revenue = Math.round(monthData.revenue * d.revPct)
      const expense = Math.round(monthData.expense * d.expPct)
      return {
        label: d.week,
        revenue,
        expense,
        netProfit: revenue - expense,
      }
    })
  }

  // Default: monthly
  // Sorted 1-12
  return filteredYearData
    .sort((a, b) => a.month - b.month)
    .map((item) => ({
      label: item.monthName,
      revenue: item.revenue,
      expense: item.expense,
      netProfit: item.netProfit,
    }))
}
