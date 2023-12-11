import { Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Tshirt {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', {
    default: null,
  })
  name: string;

  @Column('float', { default: 0 })
  priceToBuy: number;

  @Column('float', { default: 0 })
  priceToSell: number;

  //color, desing, size
}
