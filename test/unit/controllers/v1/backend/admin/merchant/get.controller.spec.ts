import { MerchantGetController } from '@controller/v1/backend/admin/merchant/merchant-get.controller';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { get } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('MerchantGetController', () => {
  let controller: MerchantGetController;
  let merchantService: Partial<MerchantService>;

  beforeEach(async () => {
    merchantService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MerchantGetController],
      providers: [
        {
          provide: MerchantService,
          useValue: merchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantGetController>(MerchantGetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    jest.spyOn(merchantService, 'get').mockImplementation((): any => {
      const merchantA: MerchantEntity = plainToInstance(MerchantEntity, {
        id: 1,
        title: '{"en":"test 1"}',
        description: '{"en":"test 1"}',
        settings: '{ "test": "test" }',
        domain: 'test1.com',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const merchantB: MerchantEntity = plainToInstance(MerchantEntity, {
        id: 2,
        title: '{"en":"test 2"}',
        description: '{"en":"test 2"}',
        settings: '{ "test": "test" }',
        domain: 'test2.com',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const merchantC: MerchantEntity = plainToInstance(MerchantEntity, {
        id: 3,
        title: '{"en":"test 3"}',
        description: '{"en":"test 3"}',
        settings: '{ "test": "test" }',
        domain: 'test1.com',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      return Promise.resolve({
        items: [merchantA, merchantB, merchantC],
        meta: {
          totalItems: 3,
          itemCount: 3,
          itemsPerPage: 30,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      } as Pagination<MerchantEntity>);
    });

    const response = await controller.get({});

    expect(get(response, 'data').length).toEqual(3);
    expect(get(response, 'meta')).toBeDefined();
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest.spyOn(merchantService, 'get').mockRejectedValue(new Error('error'));

    try {
      await controller.get({});
    } catch (error) {
      done();
    }
  });
});
