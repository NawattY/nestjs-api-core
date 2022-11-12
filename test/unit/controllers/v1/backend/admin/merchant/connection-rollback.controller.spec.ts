import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from 'src/app/tenancy/tenancy.service';
import { MerchantConnectionRollbackController } from '@controller/v1/backend/admin/merchant/merchant-connection-rollback.controller';

describe('MerchantConnectionMigrateController', () => {
  let controller: MerchantConnectionRollbackController;
  let service: TenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MerchantConnectionRollbackController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            rollbackAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MerchantConnectionRollbackController>(
      MerchantConnectionRollbackController,
    );
    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    jest.spyOn(service, 'rollbackAll').mockResolvedValue();

    const response = await controller.rollback();

    expect(response).toBeUndefined();
  });

  it('throw exception', async (done) => {
    jest.spyOn(service, 'rollbackAll').mockRejectedValue(new Error('error'));

    try {
      await controller.rollback();
    } catch (error) {
      done();
    }
  });
});
