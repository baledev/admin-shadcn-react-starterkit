import { Badge } from "@workspace/ui/components/badge"
import { type Customer } from "@/lib/customers-data"

// ─── Status badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: Customer["status"] }) {
  const styles: Record<Customer["status"], string> = {
    active:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
    inactive:
      "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
    pending:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  }
  return (
    <Badge variant="outline" className={`capitalize ${styles[status]}`}>
      {status}
    </Badge>
  )
}

// ─── Plan badge ───────────────────────────────────────────────────────────────
export function PlanBadge({ plan }: { plan: Customer["plan"] }) {
  const styles: Record<Customer["plan"], string> = {
    free: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
    pro: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
    enterprise:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
  }
  return (
    <Badge variant="outline" className={`capitalize ${styles[plan]}`}>
      {plan}
    </Badge>
  )
}
