import { AdministratorDestroyController } from '@controller/v1/backend/admin/administrator/administrator-destroy.controller';
import { UserEntity } from 'src/app/entities/default/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserType } from '@enums/user-type';
import { get } from 'lodash';
import { plainToInstance } from 'class-transformer';

describe('AdministratorDestroyController', () => {
  let controller: AdministratorDestroyController;
  let service: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AdministratorDestroyController],
      providers: [
        {
          provide: AdministratorService,
          useValue: {
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdministratorDestroyController>(
      AdministratorDestroyController,
    );
    service = module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockAuthUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'first name',
      email: 'test@email.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0000000000',
      type: UserType.MERCHANT,
      profileImage: null,
      merchantId: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(service, 'destroy').mockResolvedValue();

    const response = await controller.destroy(2, mockAuthUser);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(service.destroy).toBeCalledWith(2, mockAuthUser);
  });

  it('throw exception', async (done) => {
    const mockAuthUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'first name',
      email: 'test@email.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0000000000',
      type: UserType.MERCHANT,
      profileImage: null,
      merchantId: 1,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(service, 'destroy').mockRejectedValue(new Error('error'));

    try {
      await controller.destroy(2, mockAuthUser);
    } catch (error) {
      done();
    }
  });
});
