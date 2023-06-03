import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  //   ___        __         _               _
  //  |_ _|_ __  / _| ___   | |__   __ _ ___(_) ___ __ _
  //   | || '_ \| |_ / _ \  | '_ \ / _` / __| |/ __/ _` |
  //   | || | | |  _| (_) | | |_) | (_| \__ \ | (_| (_| |
  //  |___|_| |_|_|  \___/  |_.__/ \__,_|___/_|\___\__,_|

  @ApiProperty({
    description: 'Nombre del producto',
    nullable: false,
    minLength: 4,
  })
  @IsString()
  @MinLength(1)
  title: string;

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

  @ApiProperty({
    description: 'Stock del producto, puede ser opcional',
    nullable: true,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;
}
