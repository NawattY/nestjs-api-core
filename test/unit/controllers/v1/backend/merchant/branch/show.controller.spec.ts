import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { BranchShowController } from '@controller/v1/backend/merchant/branch/branch-show.controller';
import { BranchService } from '@services/backend/branch.service';
import { BranchEntity } from 'src/app/entities/tenant/branch.entity';
import { get } from 'lodash';

describe('BranchShowController', () => {
  let controller: BranchShowController;
  let fakeBranchService: Partial<BranchService>;

  const branch: BranchEntity = plainToInstance(BranchEntity, {
    id: 1,
  });

  beforeEach(async () => {
    fakeBranchService = {
      findById: (id: number) => {
        const branch: BranchEntity = plainToInstance(BranchEntity, {
          id: id,
          title: '{"en":"test 1"}',
          description: '{"en":"test 1"}',
          settings: '{ "test": "test" }',
          domain: 'test1.com',
          isActive: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });

        return Promise.resolve(branch);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchShowController],
      providers: [
        {
          provide: BranchService,
          useValue: fakeBranchService,
        },
      ],
    }).compile();

    controller = module.get<BranchShowController>(BranchShowController);
  });

  it('should return ok', async () => {
    const response = await controller.show(branch.id);

    expect(get(response, 'data.id')).toEqual(branch.id);
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeBranchService, 'findById')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.show(branch.id);
    } catch (error) {
      done();
    }
  });
});
