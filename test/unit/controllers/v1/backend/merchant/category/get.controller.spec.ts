import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { CategoryGetController } from '@controller/v1/backend/merchant/category/category-get.controller';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('CategoryGetController', () => {
  let controller: CategoryGetController;
  let fakeCategoryService: Partial<CategoryService>;

  beforeEach(async () => {
    fakeCategoryService = {
      get: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryGetController],
      providers: [
        {
          provide: CategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();
    controller = module.get<CategoryGetController>(CategoryGetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok', async () => {
    jest.spyOn(fakeCategoryService, 'get').mockImplementation((): any => {
      const category1: CategoryEntity = plainToInstance(CategoryEntity, {
        id: 1,
      });
      const category2: CategoryEntity = plainToInstance(CategoryEntity, {
        id: 2,
      });
      const category3: CategoryEntity = plainToInstance(CategoryEntity, {
        id: 3,
      });

      return Promise.resolve({
        items: [category1, category2, category3],
        meta: {
          totalItems: 3,
          itemCount: 3,
          itemsPerPage: 30,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      } as Pagination<CategoryEntity>);
    });

    const response = await controller.get({});

    expect(get(response, 'data').length).toEqual(3);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeCategoryService, 'get')
      .mockRejectedValue(new Error('error'));
    try {
      await controller.get({});
    } catch (error) {
      done();
    }
  });
});
