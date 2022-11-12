import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupportLocaleService } from '@services/backend/support-locale.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { MerchantEntity } from '@entities/default/merchant.entity';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('AuthLogout', () => {
  let supportLocaleService: SupportLocaleService;
  let merchantRepository: Repository<MerchantEntity>;
  let fakeRequest: Partial<Request>;

  beforeEach(async () => {
    fakeRequest = {
      merchantId: 1,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        SupportLocaleService,
        {
          provide: getRepositoryToken(MerchantEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
        {
          provide: REQUEST,
          useValue: fakeRequest,
        },
      ],
    }).compile();

    merchantRepository = module.get<Repository<MerchantEntity>>(
      getRepositoryToken(MerchantEntity),
    );
    supportLocaleService = await module.resolve<SupportLocaleService>(
      SupportLocaleService,
    );
    fakeRequest = module.get<Request>(REQUEST);
  });

  it('should be defined', () => {
    expect(supportLocaleService).toBeDefined();
  });

  it('should be ok', async () => {
    const mockMerchant = plainToInstance(MerchantEntity, {
      id: fakeRequest.merchantId,
      title: 'test',
      description: 'test',
      settings: JSON.parse('{ "locale": "th" }'),
      domain: 'test',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(mockMerchant);

    const result = await supportLocaleService.get();

    expect(get(result, '0.code')).toEqual(get(mockMerchant, 'settings.locale'));
  });
});
