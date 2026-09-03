import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    // NOTE (Stage 2): add `canActivate: [authGuard]` here once
    // core/guards/auth.guard.ts exists, so every child route below
    // requires a logged-in user.
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { title: 'Dashboard' },
      },
      // Stage 4+: customers, insurance-types, insurance-packages, quotes,
      // appointments, consultants, policies, payments, users routes are
      // added here as each stage is built.
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
