import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interface';
import { Employee } from '../employee/entities/employee.entity';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.owner)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
    ) {
    return this.productsService.create(createProductDto, user);
  };



  @Post('checkqr')
  @Auth(ValidRoles.owner)
  checkQrCode(
    @Body() body,
    @GetUser() user: User
  ){
    return this.productsService.checkQrCode(body);
  }



  @Get()
  @Auth(ValidRoles.owner)
  getProducts(
    @GetUser() user: User 
  ){
    return this.productsService.findAllProducts(user);
  }

  @Post('findOne')
  @Auth(ValidRoles.owner)
  @HttpCode(HttpStatus.FOUND)
  getProduct(
    @Body() body,
    @GetUser() user: User
  ){
    return this.productsService.findOne(body, user);
  };


  
}
