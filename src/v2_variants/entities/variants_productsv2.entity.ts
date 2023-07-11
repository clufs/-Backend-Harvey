import { Productsv2 } from 'src/v2_productsv2/entities/productsv2.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class VariantsProductsv2 {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('float')
  stock: number;

  @ManyToOne(() => Productsv2, (productsV2) => productsV2.variants)
  main: Productsv2;
}
