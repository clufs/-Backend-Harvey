import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePriceTierDto {
  @ApiProperty({
    example: 3,
    description: 'Cantidad mínima requerida para aplicar este precio',
  })
  @IsNumber()
  minQuantity: number;

  @ApiProperty({
    example: 4000,
    description: 'Precio aplicado para esta cantidad',
  })
  @IsNumber()
  price: number;
}
