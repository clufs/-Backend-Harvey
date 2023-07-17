import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateVariantsProductsv2Dto {
  @ApiProperty({
    description: 'id del producto Main',
    nullable: false,
    minLength: 4,
  })
  @IsString()
  @MinLength(1)
  mainProductId: string;

  @ApiProperty({
    description: 'Nombre de la variante',
    nullable: false,
    minLength: 4,
  })
  @IsString()
  @MinLength(1)
  name: string;
}
