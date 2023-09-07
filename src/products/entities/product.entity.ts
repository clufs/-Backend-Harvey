import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('products')
export class Product {
  @ApiProperty({
    example: '2275fe85-0610-4039-b324-c38bd61ee5a3',
    description: 'Id del Producto',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    example: 'Ruta 40 Tigre',
    description: 'Nombre del producto',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 'Remeras',
    description: 'Categoria del producto',
    uniqueItems: true,
  })
  @Column('text')
  category: string;

  @ApiProperty({
    example: 'Algodon Peinado Premium',
    description: 'Sub-categoria del producto',
  })
  @Column('text')
  provider: string;

  @ApiProperty({
    example: 4000,
    description: 'Precio del producto de venta',
    uniqueItems: true,
  })
  @Column({
    type: 'float',
    transformer: { to: (value) => value, from: (value) => value },
    default: 0,
  })
  priceToSell: number;

  @ApiProperty({
    example: 2000,
    description: 'Precio de compra del producto',
    uniqueItems: true,
  })
  @Column({
    type: 'float',
    transformer: { to: (value) => value, from: (value) => value },
    default: 0,
  })
  priceToBuy: number;

  @Column({
    type: 'float',
    transformer: { to: (value) => value, from: (value) => value },
    default: 0,
  })
  profit: number;

  @ApiProperty({
    example: '14',
    description: 'Stock del producto actual',
    nullable: true,
  })
  @Column('float', { default: 0 })
  stock: number;

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;
}
