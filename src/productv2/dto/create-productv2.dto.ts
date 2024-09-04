import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductv2Dto {
  @ApiProperty({
    description: 'Nombre del producto',
    nullable: false,
    minLength: 4,
  })
  @MinLength(1)
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Categoria del producto',
    nullable: false,
    minLength: 5,
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'sub categoria del producto',
    nullable: false,
    minLength: 5,
  })
  @IsString()
  subCategory: string;

  @ApiProperty({
    description: 'Proveedor del producto',
    nullable: false,
    minLength: 5,
  })
  @IsString()
  provider: string;

  @ApiProperty({
    description: 'Precio de COMPRA del productoa',
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
