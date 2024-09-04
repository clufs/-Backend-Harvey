import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSizesDto {
  @ApiProperty({
    example: "['XL', 'L']",
    description: 'Talles disponibles.',
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  sizes: string[];
}
