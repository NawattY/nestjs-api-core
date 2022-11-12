import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { BannerService } from '@services/backend/merchant/banner.service';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        title: 'N',
        startDate: '2022-09-27 17:19:00',
        endDate: '2022-09-27 17:19:00',
        image: 'http://image.jpg',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'M',
        startDate: '2022-09-27 17:19:00',
        endDate: '2022-09-27 17:19:00',
        image: 'http://image.jpg',
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
      first: 'http://localhost:3005/v1/backend/banners?limit=30',
      previous: '',
      next: '',
      last: 'http://localhost:3005/v1/backend/banners?page=1&limit=30',
    },
  }),
}));
describe('Backend -> BannerService -> Get', () => {
  let fakeMerchantConnection: Partial<Connection>;
  let fakeS3Service: Partial<S3Service>;
  let service: BannerService;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
    fakeS3Service = {
      putAsUniqueName: jest.fn(),
    };
  });

  it('should be defined', async () => {
    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);
    expect(service).toBeDefined();
  });

  it('should be ok', async () => {
    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);

    const banners = await service.get({ page: '1', perPage: '30' });

    expect(banners.items).toBeDefined();
    expect(banners.meta).toBeDefined();
    expect(banners.items.length).toEqual(2);
  });

  it('should be ok with search', async () => {
    // mock getRepository(BannerEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation((): any => ({
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
          })),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BannerService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: UploadFile,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: S3Service,
          useValue: fakeS3Service,
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);
    const dtoWithSearch = { filters: { search: 'test' } };
    const banners = await service.get({
      page: '1',
      perPage: '30',
      ...dtoWithSearch,
    });

    expect(banners.items).toBeDefined();
    expect(banners.meta).toBeDefined();
    expect(banners.items.length).toEqual(2);
  });
});
