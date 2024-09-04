import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Productv2 } from './productv2.entity';
import { Exclude } from 'class-transformer';

@Entity('priceTier')
export class PriceTier {
  @ApiProperty({
    example: '1',
    description: 'Id del nivel del precio',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    example: '3',
    description: 'Cantidad minima para aplicar este precio',
    uniqueItems: true,
  })
  @Column('int')
  minQuantity: number;

  @ApiProperty({
    example: 4000,
    description: 'Precio aplicado para esta cantidad',
  })
  @Column('float')
  price: number;

  @ManyToOne(() => Productv2, (product) => product.priceTiers, {
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  product: Productv2;
}
