import { ApiProperty } from "@nestjs/swagger";


export class SaleResponse {

  @ApiProperty({
    example: 3000,
    description: 'Precio total a cobrar',
    uniqueItems: true,
  })
  totalPrice:     number;

  @ApiProperty({
    example: 12321341832743241324,
    description: 'Fecha de creacion de la orden.',
    uniqueItems: true,
  })
  date:           number;

  @ApiProperty({
    example: 'transferencia',
    description: 'Metodo de pago.',
    uniqueItems: true,
  })
  payment_method: string;

  @ApiProperty({
    example: '2275fe85-0610-4039-b324-c38bd61ee5a3',
    description: 'Id de la orden.',
    uniqueItems: true,
  })
  id:             string;
}

