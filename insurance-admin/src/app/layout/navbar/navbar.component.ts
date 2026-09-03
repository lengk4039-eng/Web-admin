import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  /** Title of the currently active page, shown in the top bar. */
  @Input() pageTitle = 'Dashboard';

  /** Emitted when the user clicks the menu icon (used to toggle the mobile sidebar). */
  @Output() menuToggle = new EventEmitter<void>();

  /** Emitted when the user clicks "Logout" in the account menu. */
  @Output() logout = new EventEmitter<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
