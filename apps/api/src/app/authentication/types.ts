export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: Temporal.Duration;
}
