import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Productv2 } from './productv2.entity';
import { Color } from './colors.entity';

@Entity('desing')
export class Desing {
  @ApiProperty({
    example: '2275fe85-0610-4039-b324-c38bd61ee5a3',
    description: 'Id del Producto',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    example: 'Ruta 40 Tigre',
    description: 'Nombre del diseno',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  designName: string;

  @ApiProperty({
    example: '/https://blabla/narym/ruta40chapa.jpg',
    description: 'url de la imagen del producto',
    uniqueItems: true,
  })
  @Column('text')
  urlImage: string;

  //Esta es la conexion del producto y desing....
  @ManyToOne(() => Productv2, (product) => product.desing)
  product: Productv2;

  @OneToMany(() => Color, (color) => color.desing)
  color: Color[];
}
