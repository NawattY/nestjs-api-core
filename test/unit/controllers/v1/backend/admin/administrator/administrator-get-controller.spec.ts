import { AdministratorGetController } from '@controller/v1/backend/admin/administrator/administrator-get.controller';
import { UserEntity } from 'src/app/entities/default/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from '@services/backend/admin/administrator.service';
import { UserType } from '@enums/user-type';
import { plainToInstance } from 'class-transformer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { get } from 'lodash';

describe('AdministratorGetController', () => {
  let controller: AdministratorGetController;
  let service: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AdministratorGetController],
      providers: [
        {
          provide: AdministratorService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdministratorGetController>(
      AdministratorGetController,
    );
    service = module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return data with paginate', async () => {
    jest.spyOn(service, 'get').mockImplementation((): any => {
      const userA: UserEntity = plainToInstance(UserEntity, {
        id: 1,
        fullName: 'Elmer D. Adams',
        email: 'ElmerDAdams@jourrapide.com',
        password:
          '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
        mobile: '0899999999',
        type: UserType.ADMIN,
        profileImage: null,
        merchantId: 0,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const userB: UserEntity = plainToInstance(UserEntity, {
        id: 2,
        fullName: 'Timothy J. Kenner',
        email: 'TimothyJKenner@rhyta.com',
        password:
          '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
        mobile: '0899999999',
        type: UserType.ADMIN,
        profileImage: null,
        merchantId: 0,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const userC: UserEntity = plainToInstance(UserEntity, {
        id: 3,
        fullName: 'Jan A. Patton',
        email: 'JanAPatton@teleworm.us',
        password:
          '$2a$12$CTkW7tuQC4cBn262QB1dcOVCnZaNqT3V230hZ7yYJ/Stg9oKafOsK',
        mobile: '0899999999',
        type: UserType.ADMIN,
        profileImage: null,
        merchantId: 0,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return Promise.resolve({
        items: [userA, userB, userC],
        meta: {
          totalItems: 3,
          itemCount: 3,
          itemsPerPage: 30,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      } as Pagination<UserEntity>);
    });

    const response = await controller.get({ page: '1', perPage: '30' });

    expect(get(response, 'data').length).toEqual(3);
    expect(get(response, 'meta')).toBeDefined();
    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest.spyOn(service, 'get').mockRejectedValue(new Error('error'));

    try {
      await controller.get({ page: '1', perPage: '30' });
    } catch (error) {
      done();
    }
  });
});
