import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { UserService } from '@services/backend/share/user.service';
import { S3Service } from '@appotter/nestjs-s3';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { I18nService } from 'nestjs-i18n';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';

describe('UserService -> findById', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserSecurityCodeEntity),
          useValue: {},
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {},
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'foo bar',
      mobile: '0822222222',
      profileImage: null,
    });

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await userService.findById(mockUser.id);

    expect(result.id).toEqual(mockUser.id);
  });

  it('should be fails if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    try {
      await userService.findById(1);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(100001);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'USER_NOT_FOUND',
      );
    }
  });
});
