import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Patch,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interface';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.owner)
  @ApiResponse({ status: 201, description: 'Producto creado.', type: Product })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.owner)
  getProducts(@GetUser() user: User) {
    return this.productsService.findAllProducts(user);
  }

  @Post('findOne')
  @Auth(ValidRoles.owner)
  // @HttpCode(HttpStatus.FOUND)
  getProduct(@Body() body, @GetUser() user: User) {
    return this.productsService.findOne(body, user);
  }

  @Patch()
  @Auth(ValidRoles.owner)
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(updateProductDto, user);
  }

  @Get('pdf')
  @Auth(ValidRoles.owner)
  generatePdf(@Res() res: Response, @GetUser() user: User) {
    return this.productsService.generatePDF(res, user);
  }
}
