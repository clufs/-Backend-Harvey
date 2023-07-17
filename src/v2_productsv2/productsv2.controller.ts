import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Productsv2Service } from './productsv2.service';
import { CreateProductsv2Dto } from './dto/create-productsv2.dto';
import { UpdateProductsv2Dto } from './dto/update-productsv2.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';

@Controller('v2/products')
export class Productsv2Controller {
  constructor(private readonly productsv2Service: Productsv2Service) {}

  @Auth(ValidRoles.owner)
  @Post()
  create(@Body() createProductsv2Dto: CreateProductsv2Dto) {
    return this.productsv2Service.create(createProductsv2Dto);
  }

  @Get()
  findAll() {
    return this.productsv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsv2Service.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductsv2Dto: UpdateProductsv2Dto,
  ) {
    return this.productsv2Service.update(+id, updateProductsv2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsv2Service.remove(+id);
  }
}
