/** Response shape of GET /api/dashboard/summary */
export interface DashboardSummary {
  totalCustomers: number;
  pendingQuotes: number;
  todaysAppointments: number;
  activePolicies: number;
  pendingPayments: number;
}

/** One entry of GET /api/dashboard/quotes-by-status */
export interface StatusCount {
  status: string;
  count: number;
}

/** One entry of GET /api/dashboard/policies-by-insurance-type */
export interface InsuranceTypeCount {
  insuranceTypeName: string;
  count: number;
}

/** One entry of GET /api/dashboard/monthly-payments */
export interface MonthlyPaymentTotal {
  /** Format: "YYYY-MM", e.g. "2026-08" */
  month: string;
  totalAmount: number;
}
