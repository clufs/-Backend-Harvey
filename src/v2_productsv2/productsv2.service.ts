import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductsv2Dto } from './dto/create-productsv2.dto';
import { UpdateProductsv2Dto } from './dto/update-productsv2.dto';
import { Repository } from 'typeorm';
import { Productsv2 } from './entities/productsv2.entity';

@Injectable()
export class Productsv2Service {
  constructor(
    @InjectRepository(Productsv2)
    private readonly v2productRepository: Repository<Productsv2>,
  ) {}

  async create(createDto: CreateProductsv2Dto) {
    try {
      const product = this.v2productRepository.create(createDto);
      product.profit = product.priceToSell - product.priceToBuy;

      await this.v2productRepository.save(product);

      return {
        ok: true,
        product,
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  findAll() {
    return `This action returns all productsv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsv2`;
  }

  update(id: number, updateProductsv2Dto: UpdateProductsv2Dto) {
    return `This action updates a #${id} productsv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} productsv2`;
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException(
      'Porfavor revisar los logs del servidor.',
    );
  }
}
