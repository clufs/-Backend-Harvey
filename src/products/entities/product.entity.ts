import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
  subCategory: string;

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

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;

  // @Column('text')
  // slug: string;

  // @BeforeInsert()
  // addSlug() {
  //   this.slug = [this.category, this.subCategory, this.title]
  //     .map((word) => {
  //       const truncatedWord = word.substring(0, 2).toLowerCase();
  //       return truncatedWord;
  //     })
  //     .join('_');
  // }
}
