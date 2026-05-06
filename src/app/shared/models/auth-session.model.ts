export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}
