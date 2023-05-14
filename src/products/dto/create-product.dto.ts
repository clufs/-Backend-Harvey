import {
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  subCategory: string;

  @IsString()
  category: string;

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
}
