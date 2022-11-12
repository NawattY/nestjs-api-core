import { PasswordResetConfirmController } from './confirm.controller';
import { PasswordResetCheckTokenController } from './check-token.controller';
import { PasswordResetRequestController } from './password-reset-request.controller';

const PasswordResetController = [
  PasswordResetCheckTokenController,
  PasswordResetRequestController,
  PasswordResetConfirmController,
];

export default PasswordResetController;
