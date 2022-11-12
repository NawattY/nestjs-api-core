import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { UserEntity } from '@entities/default/user.entity';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MerchantService } from '@services/frontend/merchant.service';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { get } from 'lodash';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { Connection, Repository } from 'typeorm';

describe('MerchantService getSettings', () => {
  let merchantRepository: Repository<MerchantEntity>;
  let merchantService: MerchantService;
  let fakeRequest: Partial<Request>;
  let fakeCacheManager: Partial<Cache>;

  beforeEach(async () => {
    fakeCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
    };

    fakeRequest = {
      merchantId: 1,
      host: 'http://example.com',
    };

    const module = await Test.createTestingModule({
      providers: [
        MerchantService,
        TenantsService,
        ConfigService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockImplementation((): any => ({
              where: jest.fn(),
              select: jest.fn(),
              getRawOne: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useClass: Repository,
        },
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useValue: fakeCacheManager,
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
      ],
    }).compile();

    merchantService = await module.resolve<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    fakeCacheManager = module.get<Cache>(CACHE_MANAGER);
    fakeRequest = module.get<Request>(REQUEST);
  });

  it('should be defined', () => {
    expect(merchantService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: fakeRequest.merchantId,
      title: 'test',
      description: 'test',
      settings: JSON.parse(
        '{"locale":"th","logoImage":"merchant/images/image.png","primaryColor":"#000000","textOnPrimaryColor":"#000000","backgroundColor":"#000000","secondaryColor":"#000000","highlightTextColor":"","supportLocales":["th","en"]}',
      ),
      domain: fakeRequest.host,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest
      .spyOn(merchantRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockMerchant),
      }));

    const result = await merchantService.getSettings(fakeRequest.merchantId);
    expect(result).toEqual(mockMerchant.settings);
  });

  it('should throw exception if banner not found', async () => {
    jest
      .spyOn(merchantRepository, 'createQueryBuilder')
      .mockImplementation((): any => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(null),
      }));

    try {
      await merchantService.getSettings(fakeRequest.merchantId);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(200001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'MERCHANT_NOT_FOUND',
      );
    }
  });
});
