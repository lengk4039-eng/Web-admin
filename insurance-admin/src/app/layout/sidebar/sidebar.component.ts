import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/auth.model';

/**
 * One entry in the sidebar navigation menu. `roles` controls which
 * logged-in user roles see this item (ADMIN / CONSULTANT / STAFF).
 */
export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', roles: ['ADMIN', 'CONSULTANT', 'STAFF'] },
  { label: 'Customers', route: '/customers', icon: 'people', roles: ['ADMIN', 'CONSULTANT', 'STAFF'] },
  { label: 'Quotes', route: '/quotes', icon: 'request_quote', roles: ['ADMIN', 'CONSULTANT', 'STAFF'] },
  { label: 'Appointments', route: '/appointments', icon: 'event', roles: ['ADMIN', 'CONSULTANT', 'STAFF'] },
  { label: 'Insurance Types', route: '/insurance-types', icon: 'category', roles: ['ADMIN'] },
  { label: 'Insurance Packages', route: '/insurance-packages', icon: 'inventory_2', roles: ['ADMIN', 'CONSULTANT'] },
  { label: 'Consultants', route: '/consultants', icon: 'support_agent', roles: ['ADMIN'] },
  { label: 'Policies', route: '/policies', icon: 'policy', roles: ['ADMIN', 'CONSULTANT', 'STAFF'] },
  { label: 'Payments', route: '/payments', icon: 'payments', roles: ['ADMIN', 'STAFF'] },
  { label: 'Users', route: '/users', icon: 'manage_accounts', roles: ['ADMIN'] },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private authService = inject(AuthService);

  /** Emitted when a nav link is clicked, so the mobile layout can close the drawer. */
  @Output() linkClicked = new EventEmitter<void>();

  /** Only the items the logged-in user's role is allowed to see. */
  navItems = computed(() => {
    const user = this.authService.currentUser();
    if (!user) {
      return [];
    }
    return NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  });

  onLinkClick(): void {
    this.linkClicked.emit();
  }
}
