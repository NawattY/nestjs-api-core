import { MerchantStoreDto } from '@dtos/v1/backend/admin/merchant/merchant-store.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('Merchant create dto', () => {
  it('key should be define', async () => {
    const myDtoObject = plainToInstance(MerchantStoreDto, {
      title: null,
      domain: null,
      name: null,
      email: null,
      password: null,
      connectionId: null,
    });
    const errors = await validate(myDtoObject);

    const definedColumn = [
      'title',
      'domain',
      'name',
      'email',
      'password',
      'connectionId',
    ];

    definedColumn.forEach((value, index) => {
      expect(JSON.stringify(errors[index].property)).toContain(value);
    });
  });

  it('email invalid', async () => {
    const myDtoObject = plainToInstance(MerchantStoreDto, {
      email: 'test@test',
      title: 'null',
      domain: 'null',
      name: 'null',
      password: 'null',
      connectionId: 'null',
    });
    const errors = await validate(myDtoObject);

    expect(JSON.stringify(errors[0].property)).toContain('email');
    expect(
      JSON.stringify(Object.entries(errors[0].constraints)[0][1]),
    ).toContain('validation.merchant_create_email_invalid');
  });

  it('password invalid', async () => {
    const myDtoObject = plainToInstance(MerchantStoreDto, {
      email: 'test@test.com',
      title: 'null',
      domain: 'null',
      name: 'null',
      password: '123',
      connectionId: 'null',
    });
    const errors = await validate(myDtoObject);

    expect(JSON.stringify(errors[0].property)).toContain('password');
    expect(
      JSON.stringify(Object.entries(errors[0].constraints)[0][1]),
    ).toContain('validation.merchant_create_password_min');
  });
});
