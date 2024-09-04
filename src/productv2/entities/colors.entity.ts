import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Desing } from './desings.entity';
import { Size } from './sizes.entity';

@Entity('color')
export class Color {
  @ApiProperty({
    example: '2275fe85-0610-4039-b324-c38bd61ee5a3',
    description: 'Id del Producto',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    example: 'Blanco',
    description: 'Nombre del color del producto',
  })
  @Column('text', { unique: true })
  colorName: string;

  //Conexion del color con el diseÑo
  @ManyToOne(() => Desing, (desing) => desing.color)
  desing: Desing;

  @OneToMany(() => Size, (size) => size.color)
  size: Size[];

  //todo entidad de diseno
  //   Size: Size; esto es uno a muchos
}
