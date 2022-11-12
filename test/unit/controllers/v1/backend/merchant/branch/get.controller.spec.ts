import { BranchGetController } from '@controller/v1/backend/merchant/branch/branch-get.controller';
import { BannerEntity } from '@entities/tenant/banner.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { BranchService } from '@services/backend/branch.service';
import { get } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('BranchGetController', () => {
  let controller: BranchGetController;
  let branchService: Partial<BranchService>;

  beforeEach(async () => {
    branchService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BranchGetController],
      providers: [
        {
          provide: BranchService,
          useValue: branchService,
        },
      ],
    }).compile();

    controller = module.get<BranchGetController>(BranchGetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    jest.spyOn(branchService, 'get').mockImplementation((): any => {
      const branchA: BannerEntity = plainToInstance(BannerEntity, {
        id: 1,
        title: 'test',
        detail: null,
        phone: '089-9999999',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        titleTranslation: {
          th: 'test',
        },
      });
      const branchB: BannerEntity = plainToInstance(BannerEntity, {
        id: 2,
        title: 'test 2',
        detail: null,
        phone: '089-9999999',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        titleTranslation: {
          th: 'test 2',
        },
      });
      const branchC: BannerEntity = plainToInstance(BannerEntity, {
        id: 3,
        title: 'test 3',
        detail: null,
        phone: '089-9999999',
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        titleTranslation: {
          th: 'test 3',
        },
      });

      return Promise.resolve({
        items: [branchA, branchB, branchC],
        meta: {
          totalItems: 3,
          itemCount: 3,
          itemsPerPage: 30,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      } as Pagination<BannerEntity>);
    });

    const response = await controller.get({});

    expect(get(response, 'data').length).toEqual(3);
    expect(get(response, 'meta')).toBeDefined();
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest.spyOn(branchService, 'get').mockRejectedValue(new Error('error'));

    try {
      await controller.get({});
    } catch (error) {
      done();
    }
  });
});
