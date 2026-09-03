import { Component, Input } from '@angular/core';

export interface BarChartItem {
  label: string;
  value: number;
}

/**
 * A simple horizontal bar chart for comparing magnitudes across a handful
 * of categories (e.g. quote counts by status). All data must come from the
 * API - never pass hard-coded/sample values into this component.
 */
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
  @Input({ required: true }) title = '';
  @Input() data: BarChartItem[] = [];
  /** Optional prefix shown before each value, e.g. '$' for currency totals. */
  @Input() valuePrefix = '';
  @Input() emptyMessage = 'No data available.';

  get maxValue(): number {
    return Math.max(1, ...this.data.map((item) => item.value));
  }

  widthPercent(value: number): number {
    return (value / this.maxValue) * 100;
  }

  formatValue(value: number): string {
    return `${this.valuePrefix}${value.toLocaleString()}`;
  }
}
