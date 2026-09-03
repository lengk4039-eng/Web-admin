import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse, UserRole } from '../models/auth.model';

const TOKEN_KEY = 'insurance_admin_token';
const USER_KEY = 'insurance_admin_user';

/**
 * Handles login/logout and holds the currently logged-in user.
 *
 * Talks to POST /api/auth/login on the Spring Boot backend. See the
 * project notes for the exact request/response contract this endpoint
 * must implement.
 *
 * Only the JWT and the non-sensitive user profile (id, username, email,
 * role) are stored in localStorage. The password is never stored anywhere.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSignal = signal<AuthUser | null>(this.restoreUser());

  /** The logged-in user, or null if nobody is logged in. Reactive: read it in templates with currentUser(). */
  readonly currentUser = this.currentUserSignal.asReadonly();

  /** True while a user is logged in with a non-expired token. */
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  /**
   * Calls the backend login endpoint. On success, stores the token and
   * user profile and updates currentUser(). On failure, the caller
   * (LoginComponent) is responsible for showing an error message.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        const user: AuthUser = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          role: response.role,
        };
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUserSignal.set(user);
      }),
    );
  }

  /** Clears the stored session and sends the user back to the login page. */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /** The raw JWT, used by auth.interceptor.ts to set the Authorization header. */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** True if the logged-in user's role is one of the given roles. */
  hasRole(...roles: UserRole[]): boolean {
    const user = this.currentUserSignal();
    return !!user && roles.includes(user.role);
  }

  /** Rebuilds the session from localStorage on app startup/page refresh. */
  private restoreUser(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    if (!token || !rawUser) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  /**
   * Reads the `exp` claim out of a JWT to check if it has expired.
   * If the token cannot be decoded or has no `exp` claim, it is treated
   * as not expired here - the backend will still reject it with 401 on
   * the next request, which auth.interceptor.ts handles by logging out.
   */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      return false;
    }
    return Date.now() >= payload.exp * 1000;
  }

  private decodeJwtPayload(token: string): { exp?: number } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
