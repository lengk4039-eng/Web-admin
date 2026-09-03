import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Placeholder for Stage 1. The real dashboard (summary cards + charts fed by
 * live Spring Boot data) is built in Stage 3.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
