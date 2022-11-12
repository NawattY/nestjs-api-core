import { ProfileChangePasswordController } from './change-password.controller';
import { ProfileGetController } from './get.controller';
import { ProfileUpdateController } from './update.controller';

const ProfileController = [
  ProfileGetController,
  ProfileUpdateController,
  ProfileChangePasswordController,
];

export default ProfileController;
