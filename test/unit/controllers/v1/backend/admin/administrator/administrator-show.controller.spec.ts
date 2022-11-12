import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserEntity } from '@entities/default/user.entity';
import { UserType } from '@enums/user-type';
import { AdministratorShowController } from '@controller/v1/backend/admin/administrator/administrator-show.controller';
import { plainToInstance } from 'class-transformer';
import { get } from 'lodash';

describe('AdministratorShowController', () => {
  let controller: AdministratorShowController;
  let service: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministratorShowController],
      providers: [
        {
          provide: AdministratorService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdministratorShowController>(
      AdministratorShowController,
    );
    service = module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok', async () => {
    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'Elmer D. Adams',
      email: 'ElmerDAdams@jourrapide.com',
      password: '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
      mobile: '0899999999',
      type: UserType.ADMIN,
      profileImage: null,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

    const response = await controller.show(mockUser.id);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockUser.id);
  });

  it('throw an exception', async (done) => {
    jest.spyOn(service, 'findById').mockRejectedValue(new Error('error'));

    try {
      await controller.show(2);
    } catch (error) {
      done();
    }
  });
});
