import { Test } from '@nestjs/testing';
import { Connection, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { BranchService } from '@services/backend/branch.service';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '@appotter/nestjs-s3';
import { UploadFile } from '@helpers/upload-file.helper';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';

describe('BranchService -> destroy', () => {
  const sharedTestProviders = [
    BranchService,
    {
      provide: AppConfigService,
      useValue: {},
    },
    {
      provide: UploadFile,
      useValue: {},
    },
    {
      provide: S3Service,
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
    });

    const deleteResult = plainToInstance(UpdateResult, {
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
          softDelete: jest.fn().mockResolvedValue(deleteResult),
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

    const result = await service.destroy(branch.id);

    expect(result).toBeUndefined();
  });

  it('should throw exception if branch not found', async () => {
    // mock getRepository(BranchEntity)
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
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500002);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_NOT_FOUND',
      );
    }
  });

  it('should throw exception if branch delete error', async () => {
    const branch: BranchEntity = plainToInstance(BranchEntity, {
      id: 10,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');

        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(branch),
          softDelete: jest.fn().mockRejectedValue(new Error('error')),
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
      await service.destroy(1);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500004);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_DELETE_ERROR',
      );
    }
  });
});
