import { VariantsProductsv2 } from 'src/v2_variants/entities/variants_productsv2.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('v2_sizes')
export class V2Size {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text')
  size: string;

  @Column('float')
  stock: number;

  @ManyToOne(() => VariantsProductsv2, (variants) => variants.sizes)
  mainVariant: VariantsProductsv2;
}
