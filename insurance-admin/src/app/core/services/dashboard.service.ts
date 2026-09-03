import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DashboardSummary,
  InsuranceTypeCount,
  MonthlyPaymentTotal,
  StatusCount,
} from '../models/dashboard.model';

/**
 * Talks to the dashboard endpoints on the Spring Boot backend. All figures
 * shown on /dashboard come from these calls - nothing is computed or
 * invented on the frontend.
 *
 * Required backend endpoints (none of these exist yet - see chat notes
 * for the full request/response contract and controller guidance):
 *   GET /api/dashboard/summary
 *   GET /api/dashboard/quotes-by-status
 *   GET /api/dashboard/policies-by-insurance-type
 *   GET /api/dashboard/monthly-payments?months=6
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/dashboard`;

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getQuotesByStatus(): Observable<StatusCount[]> {
    return this.http.get<StatusCount[]>(`${this.baseUrl}/quotes-by-status`);
  }

  getPoliciesByInsuranceType(): Observable<InsuranceTypeCount[]> {
    return this.http.get<InsuranceTypeCount[]>(`${this.baseUrl}/policies-by-insurance-type`);
  }

  getMonthlyPayments(months = 6): Observable<MonthlyPaymentTotal[]> {
    return this.http.get<MonthlyPaymentTotal[]>(`${this.baseUrl}/monthly-payments`, {
      params: { months },
    });
  }
}
