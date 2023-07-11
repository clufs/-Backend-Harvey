import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVariantsProductsv2Dto } from './dto/create-variants_productsv2.dto';
import { UpdateVariantsProductsv2Dto } from './dto/update-variants_productsv2.dto';
import { Productsv2 } from 'src/v2_productsv2/entities/productsv2.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariantsProductsv2Service {
  constructor(
    @InjectRepository(Productsv2)
    private readonly v2_productRepository: Repository<Productsv2>,
  ) {}

  create(createVariantsProductsv2Dto: CreateVariantsProductsv2Dto) {}

  findAll() {
    return `This action returns all variantsProductsv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variantsProductsv2`;
  }

  update(id: number, updateVariantsProductsv2Dto: UpdateVariantsProductsv2Dto) {
    return `This action updates a #${id} variantsProductsv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} variantsProductsv2`;
  }
}
