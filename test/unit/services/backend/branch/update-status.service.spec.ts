import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UpdateStatusDto } from '@dtos/v1/backend/update-status.dto';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchService } from '@services/backend/branch.service';
import { BranchEntity } from '@entities/tenant/branch.entity';

describe('BranchService -> get', () => {
  const sharedTestProviders = [
    BranchService,
    {
      provide: AppConfigService,
      useValue: {},
    },
  ];

  let service: BranchService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const mockDto: UpdateStatusDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 1,
      isActive: 1,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
          update: jest.fn(),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    const result = await service.updateStatus(1, mockDto.isActive);

    expect(result).toBeUndefined();
  });

  it('should throw exception if branch update status error', async () => {
    const mockDto: UpdateStatusDto = plainToInstance(UpdateStatusDto, {
      isActive: 1,
    });

    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 1,
      title: 'branch title',
      isActive: 1,
    });

    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
          update: jest.fn().mockRejectedValue(new Error('error')),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        ...sharedTestProviders,
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    try {
      await service.updateStatus(999, mockDto.isActive);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500003);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_UPDATE_ERROR',
      );
    }
  });
});
