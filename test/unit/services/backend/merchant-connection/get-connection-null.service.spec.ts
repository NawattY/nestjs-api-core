import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { MerchantConnectionService } from '@services/backend/merchant-connection.service';

describe('MerchantConnectionService -> getConnectionNull', () => {
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
    plainToInstance(MerchantConnectionEntity, {
      id: 1,
      title: 'foo bar',
      merchantId: '0822222222',
      prefix: null,
      connection: '{}',
    });

    jest.spyOn(merchantConnectionRepository, 'find').mockResolvedValue([]);

    await service.getConnectionMerchantIsNull();
  });
});
