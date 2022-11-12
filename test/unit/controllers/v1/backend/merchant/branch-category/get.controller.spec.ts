import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { get } from 'lodash';
import { BranchCategoryGetController } from '@controller/v1/backend/merchant/branch-category/branch-category-get.controller';
import { BranchCategoryService } from '@services/backend/branch-category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';

describe('BranchCategoryGetController', () => {
  const mockBranchId = 1;
  const parameters = {
    page: 1,
    perPage: 30,
  };
  let controller: BranchCategoryGetController;
  let categoryService: BranchCategoryService;
  let fakeCategoryService: Partial<BranchCategoryService>;

  beforeEach(async () => {
    fakeCategoryService = {
      get: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BranchCategoryGetController],
      providers: [
        {
          provide: BranchCategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();

    controller = module.get<BranchCategoryGetController>(
      BranchCategoryGetController,
    );
    categoryService = module.get<BranchCategoryService>(BranchCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    jest.spyOn(categoryService, 'get').mockImplementation((): any => {
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

    const response = await controller.get(mockBranchId, parameters);

    expect(get(response, 'data').length).toEqual(3);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest.spyOn(categoryService, 'get').mockRejectedValue(new Error('error'));

    try {
      await controller.get(mockBranchId, parameters);
    } catch (error) {
      done();
    }
  });
});
