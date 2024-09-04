import { Injectable } from '@nestjs/common';
import { CreateProductv2Dto } from './dto/create-productv2.dto';
import { UpdateProductv2Dto } from './dto/update-productv2.dto';

@Injectable()
export class Productv2Service {
  create(createProductv2Dto: CreateProductv2Dto) {
    return 'This action adds a new productv2';
  }

  findAll() {
    return `This action returns all productv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productv2`;
  }

  update(id: number, updateProductv2Dto: UpdateProductv2Dto) {
    return `This action updates a #${id} productv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} productv2`;
  }
}
