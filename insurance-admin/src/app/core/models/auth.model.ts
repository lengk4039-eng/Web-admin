/** Matches the RoleName values in the backend Roles table. */
export type UserRole = 'ADMIN' | 'CONSULTANT' | 'STAFF';

/** Request body sent to POST /api/auth/login. */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Response body expected back from POST /api/auth/login. */
export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}

/** The logged-in user's info, kept in memory and localStorage. */
export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}
