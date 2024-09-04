import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Desing } from './desings.entity';
import { PriceTier } from './priceTier.entity';

@Entity('productsV2')
export class Productv2 {
  @ApiProperty({
    example: '3',
    description: 'Id del Producto',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    example: 'Remera modal',
    description: 'Nombre del producto',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 'Indumentaria',
    description: 'Categoria del producto',
    uniqueItems: true,
  })
  @Column('text')
  category: string;

  @ApiProperty({
    example: 'Remeras',
    description: 'sub categoria del producto',
    uniqueItems: true,
  })
  @Column('text')
  subCategory: string;

  @ApiProperty({
    example: 'Tienda 40',
    description: 'Proveedor de productos',
  })
  @Column('text')
  provider: string;

  @ApiProperty({
    example: 2000,
    description: 'Precio de compra del producto',
    uniqueItems: true,
  })
  @Column('float', { default: 0 })
  priceToBuy: number;

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;

  //todo entidad de diseno
  //   desing: Desing;

  @OneToMany(() => Desing, (desing) => desing.product)
  desing: Desing[];

  @OneToMany(() => PriceTier, (priceTier) => priceTier.product, {
    cascade: true,
    eager: true,
  })
  priceTiers: PriceTier[];
}
