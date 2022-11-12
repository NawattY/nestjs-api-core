import { BranchDestroyController } from '@controller/v1/backend/merchant/branch/branch-destroy.controller';
import { BranchService } from '@services/backend/branch.service';
import { BranchEntity } from 'src/app/entities/tenant/branch.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('BranchDestroyController', () => {
  let controller: BranchDestroyController;
  let fakeBranchService: Partial<BranchService>;

  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeBranchService = {
      destroy: () => Promise.resolve(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchDestroyController],
      providers: [
        {
          provide: BranchService,
          useValue: fakeBranchService,
        },
      ],
    }).compile();

    controller = module.get<BranchDestroyController>(BranchDestroyController);
  });

  it('should return nothing', async () => {
    const response = await controller.destroy(branch.id);

    expect(get(response, 'data')).toBeUndefined();
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(fakeBranchService, 'destroy')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.destroy(branch.id);
    } catch (error) {
      done();
    }
  });
});
