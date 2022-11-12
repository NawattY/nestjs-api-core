import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantConnectionService } from '@services/backend/merchant-connection.service';

describe('MerchantConnectionService -> getConnections', () => {
  let service: MerchantConnectionService;
  let merchantConnectionRepository: Repository<MerchantConnectionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        MerchantConnectionService,
        {
          provide: getRepositoryToken(MerchantConnectionEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MerchantConnectionService>(MerchantConnectionService);
    merchantConnectionRepository = module.get<
      Repository<MerchantConnectionEntity>
    >(getRepositoryToken(MerchantConnectionEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be ok', async () => {
    const mockMerchantConnection: MerchantConnectionEntity = plainToInstance(
      MerchantConnectionEntity,
      {
        id: 1,
        title: 'foo bar',
        merchantId: '0822222222',
        prefix: null,
        connection: '{}',
      },
    );

    jest
      .spyOn(merchantConnectionRepository, 'findOne')
      .mockResolvedValue(mockMerchantConnection);
    jest.spyOn(merchantConnectionRepository, 'find').mockResolvedValue([]);

    const result = await service.getMerchantConnections(
      mockMerchantConnection.id,
    );

    expect(result.id).toEqual(mockMerchantConnection.id);
  });

  it('should be ok merchant connections null', async () => {
    jest.spyOn(merchantConnectionRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(merchantConnectionRepository, 'find').mockResolvedValue([]);

    try {
      await service.getMerchantConnections(null);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(200002);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'MERCHANT_CONNECTION_FAILED',
      );
    }
  });
});
