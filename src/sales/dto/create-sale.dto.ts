import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';
import { ProductsInCart } from '../interface/productCart.interface';

export type CardType = 'credit' | 'debit';

export class CreateSaleDto {
  @ApiProperty({
    description: 'Carrito de compras',
    nullable: false,
    minLength: 1,
  })
  @IsArray()
  cart: ProductsInCart[];

  @ApiProperty({
    description: 'Metodo de pago',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  payment_method: string;

  @IsOptional()
  @IsString()
  cardType: CardType;
}
