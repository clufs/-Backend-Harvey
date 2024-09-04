import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePriceTierDto } from './create-pricetier.dto';
import { Type } from 'class-transformer';

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
    type: [CreatePriceTierDto],
    description: 'Lista de niveles de precios para diferentes cantidades',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceTierDto)
  priceTiers: CreatePriceTierDto[];
}
