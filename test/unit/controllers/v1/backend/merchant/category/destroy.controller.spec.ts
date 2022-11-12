import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { CategoryDestroyController } from '@controller/v1/backend/merchant/category/category-destroy.controller';

describe('CategoryDestroyController', () => {
  let controller: CategoryDestroyController;
  let fakeCategoryService: Partial<CategoryService>;
  const category: CategoryEntity = plainToInstance(CategoryEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeCategoryService = {
      destroy: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryDestroyController],
      providers: [
        {
          provide: CategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();
    controller = module.get<CategoryDestroyController>(
      CategoryDestroyController,
    );
  });

  it('should return ok', async () => {
    const response = await controller.destroy(category.id);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeCategoryService, 'destroy')
      .mockRejectedValue(new Error('error'));
    try {
      await controller.destroy(category.id);
    } catch (error) {
      done();
    }
  });
});
