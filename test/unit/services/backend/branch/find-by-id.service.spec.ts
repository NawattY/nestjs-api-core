import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { Test } from '@nestjs/testing';
import { get } from 'lodash';
import { AppConfigService } from 'src/config/app/config.service';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BranchService } from '@services/backend/branch.service';
import { BranchEntity } from '@entities/tenant/branch.entity';

describe('Backend -> BranchService -> findById', () => {
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
    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 10,
      title: '{"th":"เทส","en":"Test 1"}',
      detail: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    });

    // mock getRepository(BranchService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
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

    const result = await service.findById(branch.id);

    expect(result.id).toEqual(branch.id);
  });

  it('should throw exception if branch not found', async () => {
    // mock getRepository(BranchService)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(null),
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
      await service.findById(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_NOT_FOUND',
      );
    }
  });
});
