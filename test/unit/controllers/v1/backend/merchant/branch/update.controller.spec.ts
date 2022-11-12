import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { BranchUpdateController } from '@controller/v1/backend/merchant/branch/branch-update.controller';
import { BranchService } from '@services/backend/branch.service';
import { BranchEntity } from 'src/app/entities/tenant/branch.entity';
import { BranchUpdateDto } from '@dtos/v1/backend/branch/branch-update.dto';

const dto = {
  title: '{"th":"test"}',
  detail: '{"th":"test"}',
  phone: 'test.com',
  isActive: 1,
} as BranchUpdateDto;

describe('BranchUpdateController', () => {
  let controller: BranchUpdateController;
  let fakeBranchService: Partial<BranchService>;

  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeBranchService = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchUpdateController],
      providers: [
        {
          provide: BranchService,
          useValue: fakeBranchService,
        },
      ],
    }).compile();

    controller = module.get<BranchUpdateController>(BranchUpdateController);
  });

  it('should return ok', async () => {
    jest.spyOn(fakeBranchService, 'update').mockResolvedValue(branch);

    const response = await controller.update(branch.id, dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchService, 'update')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.update(branch.id, dto);
    } catch (error) {
      done();
    }
  });
});
