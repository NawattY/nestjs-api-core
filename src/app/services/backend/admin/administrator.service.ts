import { UserException } from '@exceptions/app/user.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { Repository } from 'typeorm';
import { UserType } from '@enums/user-type';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';
import { S3Service } from '@appotter/nestjs-s3';
import { s3CustomFile } from '@helpers/s3-custom-file.helper';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';
import { PATH_USER_IMAGE } from '@constants/path-upload';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { S3Exception } from '@exceptions/app/s3.exception';
import { encodeId } from '@helpers/hash-id.helper';
import { AdministratorUpdateDto } from '@dtos/v1/backend/admin/administrator/administrator-update.dto';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private s3Service: S3Service,
    private configService: ConfigService,
    private createThumbnailProvider: CreateThumbnailProvider,
  ) {}

  async get(parameters?: any): Promise<Pagination<UserEntity>> {
    const users = this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.fullName',
        'users.email',
        'users.mobile',
        'users.profileImage',
        'users.isActive',
      ])
      .where('users.type = :type', { type: UserType.ADMIN });

    if (parameters?.filters?.search) {
      users.andWhere(
        `(LOWER(users.fullName) like :search OR LOWER(users.email) like :search OR users.mobile like :search)`,
        {
          search: `%${parameters.filters.search.toLowerCase()}%`,
        },
      );
    }

    users.orderBy('users.id', 'DESC');

    const page = get(parameters, 'page');
    const perPage = get(parameters, 'perPage');

    const options = {
      page: page ? page : 1,
      limit: perPage ? perPage : 30,
      route: `${this.configService.get('APP_URL')}/v1/backend/administrators`,
    };

    return paginate<UserEntity>(users, options);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw UserException.notFound();
    }

    return user;
  }

  async destroy(id: number, authUser: UserEntity): Promise<void> {
    if (id == authUser.id) {
      throw UserException.cannotDeleteYourself();
    }

    const user = await this.findById(id);

    try {
      const dateNow = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

      await this.userRepository
        .createQueryBuilder()
        .where('id = :id', { id: user.id })
        .update({
          email: `${dateNow}_${user.email}`,
          deletedAt: dateNow,
        })
        .execute();
    } catch (error) {
      throw UserException.deleteError(error);
    }
  }

  async store(parameters: any): Promise<UserEntity> {
    const userExist = await this.userRepository.findOne({
      where: {
        email: parameters.email,
      },
    });

    if (userExist) {
      throw UserException.userExist([`${parameters.email} is exist.`]);
    }

    try {
      const profileImage = s3CustomFile(parameters.profileImage);

      if (profileImage) {
        const { origin } = await this.s3Service.putAsUniqueName(
          profileImage,
          PATH_USER_IMAGE,
        );

        const locationProfileImage = origin.Key;

        await this.createThumbnailProvider.create(
          parameters.profileImage,
          locationProfileImage.replace(PATH_USER_IMAGE, ''),
          500,
          500,
          PATH_USER_IMAGE,
        );

        parameters = Object.assign(parameters, {
          profileImage: locationProfileImage,
        });
      }
    } catch (e) {
      throw S3Exception.uploadImageError(e);
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(parameters.password, salt);

    try {
      const user = await this.userRepository.save({
        fullName: parameters.fullName,
        email: parameters.email,
        password: password,
        mobile: parameters.mobile,
        type: UserType.ADMIN,
        profileImage: parameters.profileImage || null,
        isActive: parameters.isActive,
        merchantId: 0,
      });

      return user;
    } catch (error) {
      throw UserException.createError(error);
    }
  }

  async update(id: number, parameters: AdministratorUpdateDto) {
    const user = await this.findById(id);
    let locationProfileImage = user.profileImage;

    try {
      if (parameters?.profileImage) {
        const profileImage = s3CustomFile(parameters.profileImage);

        if (profileImage) {
          const { origin } = await this.s3Service.putAsUniqueName(
            profileImage,
            PATH_USER_IMAGE,
          );

          if (user.profileImage) {
            await this.s3Service.delete(user.profileImage);
            await this.s3Service.delete(`thumbnail-${user.profileImage}`);
          }

          locationProfileImage = origin.Key;

          await this.createThumbnailProvider.create(
            parameters.profileImage,
            locationProfileImage.replace(PATH_USER_IMAGE, ''),
            500,
            500,
            PATH_USER_IMAGE,
          );
        }
      } else if (typeof parameters.profileImage !== 'undefined') {
        if (user.profileImage) {
          await this.s3Service.delete(user.profileImage);
          await this.s3Service.delete(`thumbnail-${user.profileImage}`);
        }

        locationProfileImage = null;
      }
    } catch (e) {
      throw S3Exception.uploadImageError(e);
    }

    try {
      user.fullName = parameters.fullName;
      user.mobile = parameters.mobile;
      user.profileImage = locationProfileImage;
      user.isActive = parameters.isActive;

      return await this.userRepository.save(user);
    } catch (e) {
      throw UserException.updateError();
    }
  }

  async accessMerchant(merchantId: number) {
    const hashId = encodeId(merchantId);

    return { token: hashId };
  }
}
