import { PartialType } from '@nestjs/swagger';
import { CreateSizesDto } from './create-size.dto';
import { IsNumber } from 'class-validator';

export class UpdateSizeStockDto extends PartialType(CreateSizesDto) {
  @IsNumber()
  stock: number;
}
