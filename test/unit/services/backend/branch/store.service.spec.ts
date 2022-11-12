/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from 'src/config/app/config.service';
import { MERCHANT_CONNECTION } from '@constants/merchant-connection';
import { get } from 'lodash';
import { BranchStoreDto } from '@dtos/v1/backend/branch/branch-store.dto';
import { BannerLinkEnum } from '@enums/banner-link';
import { BranchEntity } from '@entities/tenant/branch.entity';
import { BranchService } from '@services/backend/branch.service';

describe('BranchServiceStore', () => {
  let service: BranchService;
  let fakeMerchantConnection: Partial<Connection>;

  beforeEach(async () => {
    fakeMerchantConnection = {
      getRepository: jest.fn(),
    };
  });

  it('should be ok', async () => {
    const parameters = {
      title: '{"th":"เทส","en":"Test 1"}',
      detail: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    } as BranchStoreDto;

    const banner: BranchEntity = plainToInstance(BranchEntity, {
      id: 1,
      title: 'banner title',
      startDate: '2022-09-27 17:19:00',
      endDate: '2022-09-27 17:19:00',
      linkType: BannerLinkEnum.EXTERNAL,
      linkTo: 'http://example.com',
      target: '_blank',
      image: 'banner/images/19f10171-895b-4558-afef-6fd7f001b3e9.png',
      isActive: 1,
    });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(banner),
          save: jest.fn().mockResolvedValue(banner),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    const result = await service.store(parameters);
    expect(result).toEqual(banner);
  });

  it('should throw exception if banner create error', async () => {
    const parameters = {
      title: '{"th":"เทส","en":"Test 1"}',
      detail: '{"th":"เทส","en":"Test 1"}',
      phone: '0891111111',
      isActive: 1,
    } as BranchStoreDto;

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          save: jest.fn().mockRejectedValue(new Error('error')),
        };
      });

    // mock getRepository(BranchEntity)
    jest
      .spyOn(fakeMerchantConnection, 'getRepository')
      .mockImplementationOnce(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockReturnThis(),
        };
      });

    const module = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: MERCHANT_CONNECTION,
          useValue: fakeMerchantConnection,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);

    try {
      await service.store(parameters);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(500001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'BRANCH_CREATE_ERROR',
      );
    }
  });
});
