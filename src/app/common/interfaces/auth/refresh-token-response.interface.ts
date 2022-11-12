export interface AuthRefreshTokenResponseInterface {
  fullName: string;
  profileImage: string | null;
  type: string;
  accessToken: string;
  refreshToken: string;
}
