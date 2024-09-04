import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Productv2Service } from './productv2.service';
import { CreateProductv2Dto } from './dto/create-productv2.dto';
import { UpdateProductv2Dto } from './dto/update-productv2.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interface';

@Controller('productv2')
export class Productv2Controller {
  constructor(private readonly productv2Service: Productv2Service) {}

  @Post()
  @Auth(ValidRoles.owner)
  create(
    @Body() createProductv2Dto: CreateProductv2Dto,
    @GetUser() user: User,
  ) {
    return this.productv2Service.create(createProductv2Dto, user);
  }

  @Get()
  findAll() {
    return this.productv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productv2Service.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductv2Dto: UpdateProductv2Dto,
  ) {
    return this.productv2Service.update(+id, updateProductv2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productv2Service.remove(+id);
  }
}
