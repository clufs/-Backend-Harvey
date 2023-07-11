import { PartialType } from '@nestjs/swagger';
import { CreateProductsv2Dto } from './create-productsv2.dto';

export class UpdateProductsv2Dto extends PartialType(CreateProductsv2Dto) {}
