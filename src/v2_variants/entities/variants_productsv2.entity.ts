import { Productsv2 } from 'src/v2_productsv2/entities/productsv2.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { V2Size } from '../../v2_sizes/entities/v2_size.entity';

@Entity('v2_variants')
export class VariantsProductsv2 {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text')
  name: string;

  @ManyToOne(() => Productsv2, (productsV2) => productsV2.variants)
  main: Productsv2;

  @OneToMany(() => V2Size, (sizes) => sizes.mainVariant)
  sizes: V2Size;
}
