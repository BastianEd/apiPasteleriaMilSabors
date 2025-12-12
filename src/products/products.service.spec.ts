import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { INITIAL_PRODUCTS } from './data/seed-products';

const mockProductRepository = () => ({
  count: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(getRepositoryToken(Product));
  });

  describe('onModuleInit', () => {
    it('debe insertar seed data si la base de datos está vacía', async () => {
      repository.count.mockResolvedValue(0); // DB vacía

      await service.onModuleInit();

      expect(repository.save).toHaveBeenCalledWith(INITIAL_PRODUCTS);
    });

    it('NO debe insertar nada si ya existen productos', async () => {
      repository.count.mockResolvedValue(5); // DB con datos

      await service.onModuleInit();

      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    it('findAll debe retornar arreglo de productos', async () => {
      const products = [{ id: 1, name: 'Cake' }];
      repository.find.mockResolvedValue(products);
      expect(await service.findAll()).toEqual(products);
    });

    it('create debe guardar un producto', async () => {
      const dto = { name: 'New Cake' } as any;
      repository.create.mockReturnValue(dto);
      repository.save.mockResolvedValue({ id: 1, ...dto });

      expect(await service.create(dto)).toEqual({ id: 1, ...dto });
    });
  });
});
