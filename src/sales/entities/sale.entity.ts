import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import {
  AfterInsert,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { ProductsInCart } from '../interface/productCart.interface';

@Entity('sales')
export class Sale {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @ApiProperty({
    example: '2275fe85-0610-4039-b324-c38bd61ee5a3',
    description: 'Id del Producto',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: `
      [
        {
          id: '2275fe85-0610-4039-b324-c38bd61ee5a3',
          cant: 2,
        }
      ]
    `,
    description: 'Productos en el vendidos',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  cart: string[];

  @ApiProperty({
    example: '4000',
    description:
      'Total ingresos. Osea el total sin con ganancias y precio de reposicion',
    uniqueItems: true,
  })
  @Column('float')
  totalPrice: number;

  @ApiProperty({
    example: '1000',
    description: 'Total de las ganancias de la orden',
    uniqueItems: true,
  })
  @Column('float')
  totalProfit: number;

  @ApiProperty({
    example: '09/02/2022',
    description: 'Fecha de la compra.',
  })
  @Column('text')
  date: string;

  @ApiProperty({
    example: '02/2022',
    description: 'Mes creacion de la orden',
  })
  @Column('text')
  period: string;

  @ManyToOne(() => Employee, (emp) => emp.sales, {
    eager: true,
  })
  seller: Employee;

  @ApiProperty({
    example: 'transferencia',
    description: 'Metodo de pago.',
    uniqueItems: true,
  })
  @Column('text')
  payment_method: 'efectivo' | 'deposito' | 'tarjeta';

  @BeforeInsert()
  async updateProductStock() {
    // Obtener los productos en el carrito
    const productsInCart: ProductsInCart[] = this.cart.map((product) =>
      JSON.parse(product),
    );

    // Actualizar el stock de cada producto en el carrito
    for (const productInCart of productsInCart) {
      // Obtener el producto
      const product = await this.productRepository.findOne({
        where: { id: productInCart.id },
      });

      // Actualizar el stock del producto
      product.stock -= productInCart.cant;
      await this.productRepository.save(product);
    }
  }
}
