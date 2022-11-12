import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantConnectionService } from '@services/frontend/merchant-connection.service';

describe('MerchantConnectionService -> getConnection', () => {
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
    const mockUser: MerchantConnectionEntity = plainToInstance(
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
      .mockResolvedValue(mockUser);

    const result = await service.getConnection(mockUser.id);

    expect(result.id).toEqual(mockUser.id);
  });

  it('should be fails if merchant connection failed', async () => {
    jest.spyOn(merchantConnectionRepository, 'findOne').mockResolvedValue(null);

    try {
      await service.getConnection(1);
    } catch (error) {
      expect(get(error.getResponse(), 'errorCode')).toEqual(200002);
      expect(get(error.getResponse(), 'errorMessage')).toEqual(
        'MERCHANT_CONNECTION_FAILED',
      );
    }
  });
});
