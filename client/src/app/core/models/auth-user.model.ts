export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthTokenDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
  email: string;
}
