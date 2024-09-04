// dto/create-desing.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString } from 'class-validator';

export class CreateDesingDto {
  @ApiProperty({ example: 'Diseño exclusivo' })
  @MinLength(1)
  @IsString()
  designName: string;

  @ApiProperty({ example: 'https://cloudfire/narim/foto.jpg' })
  @MinLength(1)
  @IsString()
  urlImage: string;
}
