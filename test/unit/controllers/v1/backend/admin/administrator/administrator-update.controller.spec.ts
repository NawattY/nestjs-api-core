import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserEntity } from '@entities/default/user.entity';
import { UserType } from '@enums/user-type';
import { AdministratorUpdateController } from '@controller/v1/backend/admin/administrator/administrator-update.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { plainToInstance } from 'class-transformer';
import { AdministratorUpdateDto } from '@dtos/v1/backend/admin/administrator/administrator-update.dto';
import { get } from 'lodash';

describe('AdministratorUpdateController', () => {
  let controller: AdministratorUpdateController;
  let service: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [AdministratorUpdateController],
      providers: [
        {
          provide: AdministratorService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdministratorUpdateController>(
      AdministratorUpdateController,
    );
    service = module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('update should be ok', async () => {
    const userDto: AdministratorUpdateDto = plainToInstance(
      AdministratorUpdateDto,
      {
        fullName: 'hello wow',
        mobile: '0861111111',
        profileImage: null,
        isActive: 1,
      },
    );

    const mockUser: UserEntity = plainToInstance(UserEntity, {
      id: 1,
      fullName: 'test test',
      email: 'test@test.com',
      password: '$2b$10$eCRkJIpt26nGdz2Xth35ieBIhrZK4yITaYZPE8yvZkNM8YaZokBDi',
      profileImage: null,
      mobile: '0999999999',
      type: UserType.ADMIN,
      merchantId: 0,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(service, 'update').mockResolvedValue(mockUser);

    const response = await controller.update(1, userDto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data.id')).toEqual(mockUser.id);
  });

  it('throw exception', async (done) => {
    const userDto: AdministratorUpdateDto = plainToInstance(
      AdministratorUpdateDto,
      {
        fullName: 'hello wow',
        mobile: '0861111111',
        profileImage: null,
        isActive: 1,
      },
    );

    jest.spyOn(service, 'update').mockRejectedValue(new Error('error'));

    try {
      await controller.update(1, userDto);
    } catch (error) {
      done();
    }
  });
});
