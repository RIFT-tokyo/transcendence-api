export interface UserSession {
  userId: number;
  isTwoFaEnabled: boolean;
  isTwoFaAuthenticated: boolean;
}
