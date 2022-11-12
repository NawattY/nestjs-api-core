import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { CategoryShowController } from '@controller/v1/backend/merchant/category/category-show.controller';

describe('CategoryShowController', () => {
  let controller: CategoryShowController;
  let fakeCategoryService: Partial<CategoryService>;
  const category: CategoryEntity = plainToInstance(CategoryEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeCategoryService = {
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryShowController],
      providers: [
        {
          provide: CategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();
    controller = module.get<CategoryShowController>(CategoryShowController);
  });

  it('should return ok', async () => {
    const response = await controller.show(category.id, {});

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeCategoryService, 'findById')
      .mockRejectedValue(new Error('error'));
    try {
      await controller.show(category.id, {});
    } catch (error) {
      done();
    }
  });
});
