import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNumber, IsPositive } from 'class-validator';

export class CreateProductsv2Dto {
  @ApiProperty({
    description: 'Nombre del producto',
    nullable: false,
    minLength: 4,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Categoria del producto',
    nullable: false,
    minLength: 5,
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Proveedor del producto',
    nullable: false,
    minLength: 5,
  })
  @IsString()
  provider: string;

  @ApiProperty({
    description: 'Precio de COMPRA del producto',
    nullable: false,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  priceToBuy: number;

  @ApiProperty({
    description: 'Precio de VENTA del producto',
    nullable: false,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  priceToSell: number;
}
