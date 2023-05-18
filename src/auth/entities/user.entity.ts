import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { ValidRoles } from '../interface';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('users')
export class User {
  //* ----------------------------------------------------

  @ApiProperty({
    example: '2275fe85-0610-4039-b324-c38bd61ee5a3',
    description: 'User id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //* ----------------------------------------------------

  @ApiProperty({
    example: 'example@google.com',
    description: 'Email del usuario',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
    default: null,
  })
  email: string;

  //* ----------------------------------------------------

  //* ----------------------------------------------------

  @ApiProperty({
    example: '3887654114',
    description: 'Numero del usuario',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  phone: string;

  //* ----------------------------------------------------

  //* ----------------------------------------------------

  @ApiProperty({
    example: 'Tienda 40',
    description: 'Nombre del local/empresa.',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
    default: null,
  })
  company: string;

  //* ----------------------------------------------------

  @ApiProperty({
    example: '$2b$10$xbCNWhBw4oOfDUICeSYORuk2azBQmf7kdCMHWJ7Iboi8NpW1zF8cm',
    description: 'Password del usuario',
    uniqueItems: true,
  })
  @Column('text')
  password: string;

  //* ----------------------------------------------------

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
    uniqueItems: true,
  })
  @Column('text')
  fullName: string;

  //* ----------------------------------------------------

  @ApiProperty({
    example: true,
    description: 'Estado de la cuenta',
    uniqueItems: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  //* ----------------------------------------------------

  @ApiProperty({
    example: ['user'],
    description: 'Roles que posee el usuario',
    uniqueItems: true,
  })
  @Column('text', {
    array: true,
    default: [ValidRoles.owner],
  })
  roles: string[];

  @OneToMany(
    () => Product, //esta es a donde lo apunto
    (prod) => prod.user,
  )
  product: Product;

  @OneToMany(
    () => Employee, //esta es a donde lo apunto
    (emp) => emp.owner,
  )
  employees: Employee;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
