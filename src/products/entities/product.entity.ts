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
  @PrimaryGeneratedColumn('uuid')
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
    example: '1',
    description: 'Nombre del producto',
    uniqueItems: true,
  })
  @Column('text', { nullable: true })
  size?: string;

  @ApiProperty({
    example: 'Negro',
    description: 'Color',
    uniqueItems: true,
  })
  @Column('text', { nullable: true })
  color?: string;

  @ApiProperty({
    example: 2000,
    description: 'Precio del producto de venta',
    uniqueItems: true,
  })
  @Column('float', { default: 0 })
  priceToSell: number;

  @ApiProperty({
    example: 2000,
    description: 'Precio de compra del producto',
    uniqueItems: true,
  })
  @Column('float', { default: 0 })
  priceToBuy: number;

  @Column('float', {
    default: 0,
  })
  profit: number;

  @ApiProperty({
    example: '14',
    description: 'Stock del producto actual',
    uniqueItems: true,
  })
  @Column('float', { default: 0 })
  stock: number;

  @ApiProperty({
    example: '[Remeras Modal]',
    description: 'Tags de el producto',
    uniqueItems: true,
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: 'Nostrud pariatur excepteur et enim nostrud.',
    description: 'Codigo del producto para poder leerlo por QR.',
    uniqueItems: true,
  })
  @Column('text')
  code: string;

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;
}
