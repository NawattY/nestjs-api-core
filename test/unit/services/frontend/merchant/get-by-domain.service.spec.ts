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

describe('MerchantService getByDomain', () => {
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
            findOne: jest.fn(),
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
      settings: JSON.parse('{ "locale": "th" }'),
      domain: fakeRequest.host,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(mockMerchant);

    const changed = await merchantService.getByDomain(fakeRequest.host);
    expect(changed).toEqual(mockMerchant);
  });

  it('should be return error merchant not found.', async () => {
    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(null);

    try {
      await merchantService.getByDomain(fakeRequest.host);
    } catch (err) {
      expect(get(err.getResponse(), 'errorCode')).toEqual(200001);
      expect(get(err.getResponse(), 'errorMessage')).toEqual(
        'MERCHANT_NOT_FOUND',
      );
    }
  });
});
