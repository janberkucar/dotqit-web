export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** Identity roles from login response (e.g. Admin, Hr, Employee). */
  roles: string[];
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}
