import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { CategoryService } from '@services/backend/category.service';
import { CategoryEntity } from '@entities/tenant/categories.entity';
import { CategoryUpdateDto } from '@dtos/v1/backend/category/category-update.dto';
import { CategoryUpdateController } from '@controller/v1/backend/merchant/category/category-update.controller';
const dto = {
  title: 'sssss',
} as CategoryUpdateDto;

describe('CategoryUpdateController', () => {
  let controller: CategoryUpdateController;
  let fakeCategoryService: Partial<CategoryService>;
  const category: CategoryEntity = plainToInstance(CategoryEntity, {
    id: 1,
    title: 'rrrrr',
  });

  beforeEach(async () => {
    fakeCategoryService = {
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryUpdateController],
      providers: [
        {
          provide: CategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();
    controller = module.get<CategoryUpdateController>(CategoryUpdateController);
  });

  it('should return ok', async () => {
    const response = await controller.update(category.id, dto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeCategoryService, 'update')
      .mockRejectedValue(new Error('error'));
    try {
      await controller.update(category.id, dto);
    } catch (error) {
      done();
    }
  });
});
