import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariantsProductsv2Service } from './variants_productsv2.service';
import { CreateVariantsProductsv2Dto } from './dto/create-variants_productsv2.dto';
import { UpdateVariantsProductsv2Dto } from './dto/update-variants_productsv2.dto';

@Controller('variants-productsv2')
export class VariantsProductsv2Controller {
  constructor(private readonly variantsProductsv2Service: VariantsProductsv2Service) {}

  @Post()
  create(@Body() createVariantsProductsv2Dto: CreateVariantsProductsv2Dto) {
    return this.variantsProductsv2Service.create(createVariantsProductsv2Dto);
  }

  @Get()
  findAll() {
    return this.variantsProductsv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantsProductsv2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVariantsProductsv2Dto: UpdateVariantsProductsv2Dto) {
    return this.variantsProductsv2Service.update(+id, updateVariantsProductsv2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantsProductsv2Service.remove(+id);
  }
}
