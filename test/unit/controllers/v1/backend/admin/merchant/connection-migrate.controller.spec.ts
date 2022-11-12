import { Test, TestingModule } from '@nestjs/testing';
import { MerchantConnectionMigrateController } from '@controller/v1/backend/admin/merchant/merchant-connection-migrate.controller';
import { TenantsService } from 'src/app/tenancy/tenancy.service';

describe('MerchantConnectionMigrateController', () => {
  let controller: MerchantConnectionMigrateController;
  let service: TenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MerchantConnectionMigrateController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            migrateAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MerchantConnectionMigrateController>(
      MerchantConnectionMigrateController,
    );
    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    jest.spyOn(service, 'migrateAll').mockResolvedValue();

    const response = await controller.migration();

    expect(response).toBeUndefined();
  });

  it('throw exception', async (done) => {
    jest.spyOn(service, 'migrateAll').mockRejectedValue(new Error('error'));

    try {
      await controller.migration();
    } catch (error) {
      done();
    }
  });
});
