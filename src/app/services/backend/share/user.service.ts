import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/app/entities/default/user.entity';
import { ProfileUpdateDto } from '@dtos/v1/backend/share/profile/profile-update.dto';
import { S3ModuleUploadedFile, S3Service } from '@appotter/nestjs-s3';
import { get, isEmpty } from 'lodash';
import { UserException } from '@exceptions/app/user.exception';
import { PATH_USER_IMAGE } from '@constants/path-upload';
import { s3CustomFile } from '@helpers/s3-custom-file.helper';
import { ChangePasswordDto } from '@dtos/v1/backend/share/profile/change-password.dto';
import * as bcrypt from 'bcrypt';
import { S3Exception } from '@exceptions/app/s3.exception';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { getThumbnail } from '@helpers/thumbnail.helper';
import { I18nService } from 'nestjs-i18n';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { PasswordResetConfirmDto } from '@dtos/v1/backend/share/password-reset/password-reset-confirm.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserSecurityCodeEntity)
    private userSecurityCodeRepository: Repository<UserSecurityCodeEntity>,
    private s3Service: S3Service,
    private createThumbnailProvider: CreateThumbnailProvider,
    private readonly i18n: I18nService,
  ) {}

  /**
   * @param payloadUser
   * @param dto
   * @returns UserEntity
   */
  async modify(payloadUser: any, dto: ProfileUpdateDto): Promise<UserEntity> {
    const userId = get(payloadUser, 'id');
    const oldImage = get(payloadUser, 'profileImage');
    const thumbnail = oldImage ? getThumbnail(oldImage) : null;
    let profileImage = oldImage;

    try {
      if (!isEmpty(dto.profileImage)) {
        const customFile = s3CustomFile(dto.profileImage);

        if (customFile) {
          profileImage = await this.uploadImageToS3(
            customFile,
            PATH_USER_IMAGE,
          );

          await this.createThumbnailProvider.create(
            dto.profileImage,
            profileImage.replace(PATH_USER_IMAGE, ''),
            500,
            500,
            PATH_USER_IMAGE,
          );
        }
      } else {
        // empty | null | undefined
        if (typeof dto.profileImage !== 'undefined' && oldImage) {
          await this.s3Service.delete(oldImage);
          await this.s3Service.delete(thumbnail);

          profileImage = null;
        }
      }
    } catch (error) {
      throw S3Exception.uploadImageError(error);
    }

    try {
      const user = await this.findById(userId);

      user.fullName = dto.fullName.trim();
      user.mobile = dto.mobile;
      user.profileImage = profileImage;

      const userUpdate = await this.userRepository.save(user);

      if (userUpdate && profileImage && oldImage && profileImage !== oldImage) {
        await this.s3Service.delete(oldImage);
        await this.s3Service.delete(thumbnail);
      }

      return userUpdate;
    } catch (error) {
      throw UserException.updateError();
    }
  }

  /**
   * @param id
   * @returns UserEntity
   */
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        isActive: 1,
      },
    });

    if (!user) {
      throw UserException.notFound();
    }

    return user;
  }

  /**
   * @param payloadUser
   * @param dto
   * @returns void
   */
  async changePassword(
    payloadUser: any,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const lang = process.env.LOCALE;
    const userId = get(payloadUser, 'id');
    const userPassword = get(payloadUser, 'password');

    const oldPassword = dto.oldPassword;
    const newPassword = dto.password;

    const checkOldPassword = await bcrypt.compare(oldPassword, userPassword);
    const errors = Object();

    if (!checkOldPassword) {
      errors['oldPassword'] = [
        this.i18n.t('validation.change_password_old_password_incorrect', {
          lang: lang,
        }),
      ];

      throw UserException.oldPasswordWrong(errors);
    }

    const checkDuplicate = await bcrypt.compare(newPassword, userPassword);

    if (checkDuplicate) {
      errors['password'] = [
        this.i18n.t(
          'validation.change_password_old_password_duplicate_password',
          {
            lang: lang,
          },
        ),
      ];

      errors['passwordConfirm'] = [''];

      throw UserException.passwordDuplicate(errors);
    }

    const user = await this.findById(userId);

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw UserException.changePasswordError();
    }
  }

  /**
   * @param token
   * @returns UserSecurityCodeEntity
   */
  async checkPasswordReset(token: string): Promise<UserSecurityCodeEntity> {
    const securityCode = await this.userSecurityCodeRepository.findOne({
      where: {
        token: token,
      },
    });

    if (!securityCode) {
      throw UserException.securityCodeNotFound();
    }

    const now = new Date().getTime();
    const expiredAt = new Date(securityCode.expiredAt).getTime();

    if (now >= expiredAt) {
      throw UserException.securityCodeExpired();
    }

    return securityCode;
  }

  /**
   * @param parameters
   * @returns void
   */
  async confirmPasswordReset(
    parameters: PasswordResetConfirmDto,
  ): Promise<void> {
    const securityCode = await this.userSecurityCodeRepository.findOne({
      where: {
        token: parameters.token,
      },
    });

    if (!securityCode) {
      throw UserException.securityCodeNotFound();
    }

    const expiredAt = new Date(securityCode.expiredAt).getTime();

    if (new Date().getTime() >= expiredAt) {
      throw UserException.securityCodeExpired();
    }

    const salt = await bcrypt.genSalt();
    const passwordToken = await bcrypt.hash(parameters.password, salt);
    let isUpdated = false;

    try {
      const userUpdated = await this.userRepository.update(
        securityCode.userId,
        {
          password: passwordToken,
        },
      );

      isUpdated = get(userUpdated, 'affected') > 0;

      if (!isUpdated) {
        UserException.notFound();
      }

      await this.userSecurityCodeRepository.delete(securityCode.id);
    } catch (error) {
      UserException.confirmPasswordResetError(error);
    }
  }

  /**
   * @param file S3ModuleUploadedFile
   * @param path string
   * @returns key to which the object was uploaded.
   */
  async uploadImageToS3(
    file: S3ModuleUploadedFile,
    path: string,
  ): Promise<string> {
    const uploadS3 = await this.s3Service.putAsUniqueName(file, path);

    return get(uploadS3, 'origin.Key');
  }
}
