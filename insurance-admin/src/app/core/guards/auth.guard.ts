import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

/**
 * Route guard that:
 * 1. Blocks access and redirects to /login if nobody is logged in.
 * 2. Optionally checks a route's `data: { roles: [...] }` and redirects
 *    to /dashboard if the logged-in user's role is not allowed.
 *
 * Usage on a route that any logged-in user can see:
 *   { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 *
 * Usage on a route restricted to specific roles (e.g. Users management,
 * which is ADMIN-only per the requirements):
 *   {
 *     path: 'users',
 *     component: UsersListComponent,
 *     canActivate: [authGuard],
 *     data: { roles: ['ADMIN'] },
 *   }
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as UserRole[] | undefined;
  if (allowedRoles && allowedRoles.length > 0 && !authService.hasRole(...allowedRoles)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
