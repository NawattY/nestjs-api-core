import { S3Service } from '@appotter/nestjs-s3';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { UploadFile } from '@helpers/upload-file.helper';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateThumbnailProvider } from '@providers/filesystems/s3/create-thumbnail.provider';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository, Brackets } from 'typeorm';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        title: 'N',
        description: 'test',
        settings: JSON.parse('{ "test": "test" }'),
        domain: 'test',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'M',
        description: 'test',
        settings: JSON.parse('{ "test": "test" }'),
        domain: 'test2',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      first: 'http://localhost:3005/v1/backend/merchants?limit=30',
      previous: '',
      next: '',
      last: 'http://localhost:3005/v1/backend/merchants?page=1&limit=30',
    },
  }),
}));
describe('MerchantService get', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let service: MerchantService;
  // let brackets: Brackets
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MerchantService,
        TenantsService,
        ConfigService,
        Brackets,
        {
          provide: getRepositoryToken(MerchantEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: Connection,
          useFactory: () => jest.fn(),
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: CreateThumbnailProvider,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
  });

  it('should return the merchant', async () => {
    jest
      .spyOn(merchantRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      }));

    const merchants = await service.get({ page: '1', perPage: '30' });
    expect(merchants.items).toBeDefined();
    expect(merchants.meta).toBeDefined();
    expect(merchants.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
    const dtoWithSearch = { filters: { search: 'test', isActive: 1 } };
    jest
      .spyOn(merchantRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      }));

    const merchants = await service.get({
      page: '1',
      perPage: '30',
      ...dtoWithSearch,
    });

    expect(merchants.items).toBeDefined();
    expect(merchants.meta).toBeDefined();
    expect(merchants.items.length).toEqual(2);
  });
});
