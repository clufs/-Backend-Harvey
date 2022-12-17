import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ValidRoles } from '../../auth/interface/valid-roles.interface';
import { User } from '../../auth/entities/user.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    default: null,
  })
  name: string;

  @Column('text', {
    unique: true,
  })
  socket: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: [ValidRoles.employee],
  })
  roles: string[];

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  owner: User;

  @OneToMany(() => Sale, (sale) => sale.seller)
  sales: Sale;
}
