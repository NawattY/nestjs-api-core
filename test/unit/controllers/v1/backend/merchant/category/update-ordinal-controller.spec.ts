import { Test, TestingModule } from '@nestjs/testing';
import { CategoryUpdateOrdinalController } from '@controller/v1/backend/merchant/category/category-update-ordinal.controller';
import { UpdateOrdinalDto } from '@dtos/v1/backend/update-ordinal.dto';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { CategoryService } from '@services/backend/category.service';

describe('CategoryUpdateOrdinalController', () => {
  let controller: CategoryUpdateOrdinalController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CategoryUpdateOrdinalController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            updateOrdinal: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryUpdateOrdinalController>(
      CategoryUpdateOrdinalController,
    );
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockDto = plainToInstance(UpdateOrdinalDto, {
      ordinal: [
        { id: 1, ordinal: 1 },
        { id: 2, ordinal: 2 },
      ],
    });

    jest.spyOn(categoryService, 'updateOrdinal').mockResolvedValue();

    const response = await controller.updateOrdinal(mockDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(categoryService.updateOrdinal).toBeCalledWith(mockDto);
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(categoryService, 'updateOrdinal')
      .mockRejectedValue(new Error('error'));

    const mockDto = plainToInstance(UpdateOrdinalDto, {
      ordinal: [
        { id: 1, ordinal: 1 },
        { id: 2, ordinal: 2 },
      ],
    });

    try {
      await controller.updateOrdinal(mockDto);
    } catch (error) {
      done();
    }
  });
});
