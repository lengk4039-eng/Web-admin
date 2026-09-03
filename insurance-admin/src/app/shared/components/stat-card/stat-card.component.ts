import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * A single dashboard summary tile: an icon, a big number, and a label.
 * Pass `value` as null while it is still loading.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input({ required: true }) label = '';
  @Input() value: number | null = null;
  @Input() icon = 'insights';
  /** Accent color for the icon badge, e.g. '#2a78d6'. */
  @Input() accentColor = '#2a78d6';
}
