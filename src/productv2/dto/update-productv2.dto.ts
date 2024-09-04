import { PartialType } from '@nestjs/swagger';
import { CreateProductv2Dto } from './create-productv2.dto';

export class UpdateProductv2Dto extends PartialType(CreateProductv2Dto) {}
