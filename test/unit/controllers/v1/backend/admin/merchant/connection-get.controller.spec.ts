import { MerchantConnectionGetController } from '@controller/v1/backend/admin/merchant/merchant-connection-get.controller';
import { MerchantConnectionEntity } from '@entities/default/merchant-connections.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MerchantConnectionService } from '@services/backend/merchant-connection.service';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('MerchantConnectionGetController', () => {
  let controller: MerchantConnectionGetController;
  let service: MerchantConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MerchantConnectionGetController],
      providers: [
        {
          provide: MerchantConnectionService,
          useValue: {
            getMerchantConnections: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MerchantConnectionGetController>(
      MerchantConnectionGetController,
    );
    service = module.get<MerchantConnectionService>(MerchantConnectionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockMerchantConnection: MerchantConnectionEntity = plainToInstance(
      MerchantConnectionEntity,
      {
        id: 1,
        title: 1,
        merchantId: 1,
        prefix: 'postgres',
        connection:
          '{"database":"test","host":"test","port":"1234","username":"test","password":"test"}',
      },
    );

    jest
      .spyOn(service, 'getMerchantConnections')
      .mockResolvedValue(mockMerchantConnection);

    const response = await controller.getConnectionMerchant(
      mockMerchantConnection.merchantId,
    );

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockMerchantConnection.id);
  });

  it('throw exception', async (done) => {
    jest
      .spyOn(service, 'getMerchantConnections')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.getConnectionMerchant(1);
    } catch (error) {
      done();
    }
  });
});
