import { AuthLoginController } from '@controller/v1/backend/share/auth/auth-login.controller';
import { AuthRefreshTokenController } from '@controller/v1/backend/share/auth/auth-refresh-token.controller';
import { AuthLogoutController } from '@controller/v1/backend/share/auth/auth-logout.controller';

const AuthController = [
  AuthLoginController,
  AuthRefreshTokenController,
  AuthLogoutController,
];

export default AuthController;
