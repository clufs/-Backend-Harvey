// entities/t-shirt.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Design } from './desing.entity';

@Entity()
export class ModalShirt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column()
  priceToSell: number;

  @Column()
  priceToBuy: number;

  @OneToMany(() => Design, (design) => design.tShirt, { cascade: true })
  designs: Design[];
}
