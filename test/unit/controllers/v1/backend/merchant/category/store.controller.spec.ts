import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { CategoryService } from '@services/backend/category.service';
import { CategoryStoreDto } from '@dtos/v1/backend/category/category-store.dto';
import { CategoryStoreController } from '@controller/v1/backend/merchant/category/category-store.controller';
const dto = {
  title: 'sssss',
} as CategoryStoreDto;

describe('CategoryStoreController', () => {
  let controller: CategoryStoreController;
  let fakeCategoryService: Partial<CategoryService>;

  beforeEach(async () => {
    fakeCategoryService = {
      store: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryStoreController],
      providers: [
        {
          provide: CategoryService,
          useValue: fakeCategoryService,
        },
      ],
    }).compile();
    controller = module.get<CategoryStoreController>(CategoryStoreController);
  });

  it('should return ok', async () => {
    const response = await controller.store(dto);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeCategoryService, 'store')
      .mockRejectedValue(new Error('error'));
    try {
      await controller.store(dto);
    } catch (error) {
      done();
    }
  });
});
