import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { BranchStoreController } from '@controller/v1/backend/merchant/branch/branch-store.controller';
import { BranchService } from '@services/backend/branch.service';
import { BranchStoreDto } from '@dtos/v1/backend/branch/branch-store.dto';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { get } from 'lodash';

const dto = {
  title: '{"th":"test"}',
  detail: '{"th":"test"}',
  phone: 'test.com',
  isActive: 1,
} as BranchStoreDto;

describe('BranchStoreController', () => {
  let controller: BranchStoreController;
  let fakeBranchService: Partial<BranchService>;
  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
    title: '{"th":"test"}',
    detail: '{"th":"test"}',
    phone: 'test.com',
    isActive: 1,
  });

  beforeEach(async () => {
    fakeBranchService = {
      store: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchStoreController],
      providers: [
        {
          provide: BranchService,
          useValue: fakeBranchService,
        },
      ],
    }).compile();

    controller = module.get<BranchStoreController>(BranchStoreController);
  });

  it('should return ok', async () => {
    jest.spyOn(fakeBranchService, 'store').mockResolvedValue(branch);

    const response = await controller.store(dto);

    expect(get(response, 'store')).toBeUndefined();
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchService, 'store')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.store(dto);
    } catch (error) {
      done();
    }
  });
});
