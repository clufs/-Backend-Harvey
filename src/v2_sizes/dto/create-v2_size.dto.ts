import { IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';

type Sizes =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | 'talle unico';

export class CreateV2SizeDto {
  @IsString()
  mainVariantId: string;

  @IsString()
  size: Sizes;

  @IsNumber()
  @IsPositive()
  stock: number;
}
