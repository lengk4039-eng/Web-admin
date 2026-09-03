import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BarChartComponent, BarChartItem } from '../../shared/components/bar-chart/bar-chart.component';

/**
 * Dashboard overview: 5 summary cards + 3 charts, all fed by
 * DashboardService (real API calls, no hard-coded numbers).
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, StatCardComponent, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  isLoading = true;
  errorMessage: string | null = null;

  summary: DashboardSummary | null = null;
  quotesByStatus: BarChartItem[] = [];
  policiesByType: BarChartItem[] = [];
  monthlyPayments: BarChartItem[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      summary: this.dashboardService.getSummary(),
      quotesByStatus: this.dashboardService.getQuotesByStatus(),
      policiesByType: this.dashboardService.getPoliciesByInsuranceType(),
      monthlyPayments: this.dashboardService.getMonthlyPayments(),
    }).subscribe({
      next: ({ summary, quotesByStatus, policiesByType, monthlyPayments }) => {
        this.summary = summary;
        this.quotesByStatus = quotesByStatus.map((item) => ({ label: item.status, value: item.count }));
        this.policiesByType = policiesByType.map((item) => ({
          label: item.insuranceTypeName,
          value: item.count,
        }));
        this.monthlyPayments = monthlyPayments.map((item) => ({
          label: item.month,
          value: item.totalAmount,
        }));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.mapError(error);
      },
    });
  }

  private mapError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Cannot reach the server. Please check your connection and that the backend is running.';
    }
    if (error.status === 404) {
      return 'Dashboard endpoints were not found on the server. The backend needs to implement /api/dashboard/summary, /api/dashboard/quotes-by-status, /api/dashboard/policies-by-insurance-type and /api/dashboard/monthly-payments.';
    }
    return 'Unable to load dashboard data. Please try again later.';
  }
}
