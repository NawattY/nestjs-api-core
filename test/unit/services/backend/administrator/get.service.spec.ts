import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { S3ProviderModule } from '@providers/filesystems/s3/provider.module';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@entities/default/user.entity';
import { S3Service } from '@appotter/nestjs-s3';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { Repository } from 'typeorm';
import { MockType } from 'test/setup/mock.type';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        fullName: 'Elmer D. Test',
        email: 'ElmerDAdams@jourrapide.com',
        mobile: '0899999999',
        profileImage: null,
        isActive: 1,
      },
      {
        id: 2,
        fullName: 'Timothy J. Test',
        email: 'TimothyJKenner@rhyta.com',
        mobile: '0899999999',
        profileImage: null,
        isActive: 1,
      },
    ],
    meta: {
      totalItems: 2,
      itemCount: 2,
      itemsPerPage: 30,
      totalPages: 1,
      currentPage: 1,
    },
    links: {
      first: 'http://localhost:3005/v1/backend/administrators?limit=30',
      previous: '',
      next: '',
      last: 'http://localhost:3005/v1/backend/administrators?page=1&limit=30',
    },
  }),
}));

describe('AdministratorService -> get', () => {
  let userRepository: Partial<Repository<UserEntity>>;
  let administratorService: AdministratorService;

  beforeEach(async () => {
    const userRepositoryFactory: () => MockType<Repository<UserEntity>> =
      jest.fn(() => ({
        createQueryBuilder: jest.fn((entity) => entity),
      }));

    const module: TestingModule = await Test.createTestingModule({
      imports: [S3ProviderModule],
      providers: [
        AdministratorService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: userRepositoryFactory,
        },
        {
          provide: S3Service,
          useValue: {
            putAsUniqueName: jest.fn(),
          },
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    administratorService =
      module.get<AdministratorService>(AdministratorService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(administratorService).toBeDefined();
  });

  it('should be ok if not search', async () => {
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      }));

    const users = await administratorService.get({ page: '1', perPage: '30' });

    expect(users.items).toBeDefined();
    expect(users.meta).toBeDefined();
    expect(users.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
    const dtoWithSearch = { filters: { search: 'test' } };

    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      }));

    const users = await administratorService.get(dtoWithSearch);

    expect(users.items).toBeDefined();
    expect(users.meta).toBeDefined();
    expect(users.items.length).toEqual(2);
  });
});
