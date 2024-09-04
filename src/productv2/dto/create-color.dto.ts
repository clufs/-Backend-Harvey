// dto/create-desing.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({ example: 'Diseño exclusivo' })
  @MinLength(1)
  @IsString()
  colorName: string;
}
