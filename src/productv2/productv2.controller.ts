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
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interface';
import {
  CreateSizesDto,
  CreateColorDto,
  CreateDesingDto,
  CreatePriceTierDto,
  CreateProductv2Dto,
  UpdateProductv2Dto,
} from './dto';

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

  @Patch(':id')
  @Auth(ValidRoles.owner)
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateProductv2Dto: UpdateProductv2Dto,
  ) {
    return this.productv2Service.update(id, updateProductv2Dto, user);
  }

  @Post('product/:id/desings')
  @Auth(ValidRoles.owner)
  async addDesing(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() createDesingDto: CreateDesingDto,
  ) {
    return this.productv2Service.addDesing(id, createDesingDto, user);
  }

  @Post('desing/:id/colors')
  @Auth(ValidRoles.owner)
  async addColors(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() createColorDto: CreateColorDto,
  ) {
    return this.productv2Service.addColorToDesing(id, createColorDto, user);
  }

  @Post('color/:id/sizes')
  @Auth(ValidRoles.owner)
  async addSize(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() createSizeDto: CreateSizesDto,
  ) {
    return this.productv2Service.addSizes(id, createSizeDto, user);
  }
}
