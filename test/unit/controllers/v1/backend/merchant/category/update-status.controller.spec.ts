import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import { get } from 'lodash';
import { CategoryUpdateStatusController } from '@controller/v1/backend/merchant/category/category-update-status.controller';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
const dto = {
  isActive: 1,
} as UpdateStatusDto;

describe('CategoryUpdateStatusController', () => {
  let controller: CategoryUpdateStatusController;
  let fakeCategoryService: Partial<CategoryService>;
  const category: CategoryEntity = plainToInstance(CategoryEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeCategoryService = {
      updateStatus: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryUpdateStatusController],
      providers: [
        {
          provide: CategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();
    controller = module.get<CategoryUpdateStatusController>(
      CategoryUpdateStatusController,
    );
  });

  it('should return ok', async () => {
    const response = await controller.updateStatus(category.id, dto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeCategoryService, 'updateStatus')
      .mockRejectedValue(new Error('error'));
    try {
      await controller.updateStatus(category.id, dto);
    } catch (error) {
      done();
    }
  });
});
