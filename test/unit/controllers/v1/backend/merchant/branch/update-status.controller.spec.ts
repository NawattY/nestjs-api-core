import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { BranchUpdateStatusController } from '@controller/v1/backend/merchant/branch/branch-update-status.controller';
import { BranchService } from '@services/backend/branch.service';
import { BranchEntity } from 'src/app/entities/tenant/branch.entity';
import { BranchUpdateDto } from '@dtos/v1/backend/branch/branch-update.dto';

const dto = {
  isActive: 1,
} as BranchUpdateDto;

describe('BranchUpdateStatusController', () => {
  let controller: BranchUpdateStatusController;
  let fakeBranchService: Partial<BranchService>;

  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeBranchService = {
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchUpdateStatusController],
      providers: [
        {
          provide: BranchService,
          useValue: fakeBranchService,
        },
      ],
    }).compile();

    controller = module.get<BranchUpdateStatusController>(
      BranchUpdateStatusController,
    );
  });

  it('should return ok', async () => {
    jest.spyOn(fakeBranchService, 'updateStatus').mockResolvedValue();

    const response = await controller.updateStatus(branch.id, dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchService, 'updateStatus')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.updateStatus(branch.id, dto);
    } catch (error) {
      done();
    }
  });
});
