import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm';
import { VariantsProductsv2 } from '../../v2_variants/entities/variants_productsv2.entity';

@Entity('v2_products')
export class Productsv2 {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text')
  category: string;

  @Column('text')
  provider: string;

  @Column('float', { default: 0 })
  priceToSell: number;

  @Column('float', { default: 0 })
  priceToBuy: number;

  @Column('float', {
    default: 0,
  })
  profit: number;

  @OneToMany(() => VariantsProductsv2, (variants) => variants.main)
  variants: VariantsProductsv2;
}
