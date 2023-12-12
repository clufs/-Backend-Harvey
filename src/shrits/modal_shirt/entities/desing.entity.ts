// entities/design.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ModalShirt } from './modal_shirt.entity';

@Entity()
export class Design {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  desingName: string;

  @Column()
  color: string;

  @Column()
  imageUrl: string;

  @Column('json')
  sizes: { [size: string]: number };

  @ManyToOne(() => ModalShirt, (tShirt) => tShirt.designs)
  tShirt: ModalShirt;
}
