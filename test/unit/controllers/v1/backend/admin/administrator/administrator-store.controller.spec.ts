import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserEntity } from '@entities/default/user.entity';
import { UserType } from '@enums/user-type';
import { AdministratorStoreController } from '@controller/v1/backend/admin/administrator/administrator-store.controller';
import { plainToInstance } from 'class-transformer';
import { AdministratorStoreDto } from '@dtos/v1/backend/admin/administrator/administrator-store.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { get } from 'lodash';

describe('AdministratorStoreController', () => {
  let controller: AdministratorStoreController;
  let service: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [AdministratorStoreController],
      providers: [
        {
          provide: AdministratorService,
          useValue: {
            store: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdministratorStoreController>(
      AdministratorStoreController,
    );
    service = module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('store should be ok', async () => {
    const userDto: AdministratorStoreDto = plainToInstance(
      AdministratorStoreDto,
      {
        fullName: 'hello wow',
        email: 'test@admin.com',
        password: '12345678',
        passwordConfirm: '12345678',
        mobile: '0990659313',
        profileImage: null,
        isActive: 1,
      },
    );

    const newUser: UserEntity = plainToInstance(UserEntity, {
      id: 999,
      fullName: userDto.fullName,
      email: userDto.email,
      password: '12345678',
      profileImage: null,
      mobile: userDto.mobile,
      type: UserType.ADMIN,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(service, 'store').mockResolvedValue(newUser);

    const response = await controller.store(userDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(newUser.id);
  });

  it('throw exception', async (done) => {
    const userDto: AdministratorStoreDto = plainToInstance(
      AdministratorStoreDto,
      {
        fullName: 'hello wow',
        email: 'test@admin.com',
        password: '12345678',
        passwordConfirm: '12345678',
        mobile: '0990659313',
        profileImage: null,
        isActive: 1,
      },
    );

    jest.spyOn(service, 'store').mockRejectedValue(new Error('error'));

    try {
      await controller.store(userDto);
    } catch (error) {
      done();
    }
  });
});
