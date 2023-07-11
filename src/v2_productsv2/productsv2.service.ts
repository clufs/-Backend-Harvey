import { Injectable } from '@nestjs/common';
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

  create(createDto: CreateProductsv2Dto) {}

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
}
