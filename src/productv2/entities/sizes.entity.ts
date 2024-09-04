import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from './colors.entity';

@Entity('size')
export class Size {
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
  @Column('text')
  title: string;

  @ApiProperty({
    example: 'Remeras',
    description: 'Categoria del producto',
    uniqueItems: true,
  })
  @Column('int')
  stock: number;

  @ManyToOne(() => Color, (color) => color.size)
  color: Color;
}
