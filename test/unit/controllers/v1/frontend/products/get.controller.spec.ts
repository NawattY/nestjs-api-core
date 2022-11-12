import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { ProductService } from '@services/frontend/product.service';
import { ProductGetController } from '@controller/v1/frontend/products/product-get.controller';

describe('ProductGetController', () => {
  let controller: ProductGetController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGetController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductGetController>(ProductGetController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be ok', async () => {
    const mockData = [
      {
        id: 1,
        title: { th: 'กาแฟ', en: 'Coffee' },
        products: [
          {
            id: 1,
            title: { th: 'อเมริกาโน่', en: 'Americano' },
            detail: { th: 'กาแฟ', en: 'Coffee' },
            categoryId: 1,
            image: 'americano.jpb',
            isActive: 1,
            ordinal: 1,
            specialPrice: 0,
            normalPrice: 100,
          },
        ],
      },
      {
        id: 2,
        title: { th: 'ชา', en: 'Tea' },
        products: [
          {
            id: 2,
            title: { th: 'ชาเขียว', en: 'Green Tea' },
            detail: { th: 'ชา', en: 'Tea' },
            categoryId: 2,
            image: 'green-tea.jpb',
            isActive: 1,
            ordinal: 2,
            specialPrice: 0,
            normalPrice: 100,
          },
        ],
      },
    ];

    jest.spyOn(service, 'get').mockResolvedValue(mockData);

    const response = await controller.get({});

    expect(get(response, 'status.code')).toEqual(200);
    expect(get(response, 'status.message')).toEqual('OK');
    expect(get(response, 'data').length).toEqual(2);
  });

  it('throw exception', async (done) => {
    jest.spyOn(service, 'get').mockRejectedValue(new Error('error'));

    try {
      await controller.get({});
    } catch (error) {
      done();
    }
  });
});
