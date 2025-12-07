import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { INITIAL_PRODUCTS } from './data/seed-products'; // Importamos los datos

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Metodo que se ejecuta automáticamente cuando el módulo se inicia.
   * Verifica si hay productos; si no, carga los iniciales.
   */
  async onModuleInit() {
    const count = await this.productRepository.count();
    if (count === 0) {
      this.logger.log(
        'Base de datos de productos vacía. Cargando datos iniciales...',
      );
      await this.productRepository.save(INITIAL_PRODUCTS);
      this.logger.log(
        `¡Se han insertado ${INITIAL_PRODUCTS.length} productos iniciales!`,
      );
    }
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    return await this.productRepository.findOneBy({ id });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
