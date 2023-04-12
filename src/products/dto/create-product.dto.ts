import {
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  @IsPositive()
  priceToBuy: number;

  @IsNumber()
  @IsPositive()
  priceToSell: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  code: string;
}
