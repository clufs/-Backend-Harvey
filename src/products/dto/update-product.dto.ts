import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Id del producto',
    nullable: false,
    minLength: 4,
  })
  @IsString()
  @MinLength(1)
  id: string;
}
