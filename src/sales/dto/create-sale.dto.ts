import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ProductsInCart } from '../interface/productCart.interface';

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

}
