import { PartialType } from '@nestjs/swagger';
import { CreateVariantsProductsv2Dto } from './create-variants_productsv2.dto';

export class UpdateVariantsProductsv2Dto extends PartialType(CreateVariantsProductsv2Dto) {}
