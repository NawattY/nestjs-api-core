import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTemplateController } from '@controller/v1/backend/merchant/update-template.controller';
import { UpdateTemplateDto } from '@dtos/v1/backend/admin/merchant/update-template.dto';
import { get } from 'lodash';
import { MerchantService } from '@services/backend/admin/merchant.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

const dto = {
  primaryColor: '#000000',
  secondaryColor: '#000000',
  textOnPrimaryColor: '#000000',
  backgroundColor: '#000000',
  logoImage: null,
} as UpdateTemplateDto;

describe('UpdateTemplateController', () => {
  let controller: UpdateTemplateController;
  let fakeMerchantService: Partial<MerchantService>;

  beforeEach(async () => {
    fakeMerchantService = {
      updateTemplate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [UpdateTemplateController],
      providers: [
        {
          provide: MerchantService,
          useValue: fakeMerchantService,
        },
      ],
    }).compile();

    controller = module.get<UpdateTemplateController>(UpdateTemplateController);
  });

  it('should return ok', async () => {
    const response = await controller.updateTemplate(dto);

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
  });

  it('throw an exception', async (done) => {
    jest
      .spyOn(fakeMerchantService, 'updateTemplate')
      .mockRejectedValue(new Error('error'));

    try {
      await controller.updateTemplate(dto);
    } catch (error) {
      done();
    }
  });
});
