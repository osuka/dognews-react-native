// Covers oauth and direct login
export type LoginState = {
  username: string;
  password?: string;
  progress?: boolean;
  error?: string;
  accessToken?: string;
  accessTokenExpirationDate?: string;
  refreshToken?: string;
  provider?: string;
};
