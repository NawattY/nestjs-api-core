import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { BranchCategoryUpdateStatusController } from '@controller/v1/backend/merchant/branch-category/branch-category-update-status.controller';
import { BranchCategoryService } from '@services/backend/branch-category.service';

describe('BranchCategoryUpdateStatusController', () => {
  let controller: BranchCategoryUpdateStatusController;
  let categoryService: BranchCategoryService;
  let updateStatusMethod: jest.SpyInstance<
    Promise<void>,
    [id: number, parameters?: any]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BranchCategoryUpdateStatusController],
      providers: [
        {
          provide: BranchCategoryService,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchCategoryUpdateStatusController>(
      BranchCategoryUpdateStatusController,
    );
    categoryService = module.get<BranchCategoryService>(BranchCategoryService);
    updateStatusMethod = jest.spyOn(categoryService, 'updateStatus');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    updateStatusMethod.mockResolvedValue();
    const response = await controller.updateStatus(
      1,
      { branchId: 1 },
      { isActive: 1 },
    );

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    updateStatusMethod.mockRejectedValue(new Error('error'));

    try {
      await controller.updateStatus(1, { branchId: 1 }, { isActive: 1 });
    } catch (error) {
      done();
    }
  });
});
