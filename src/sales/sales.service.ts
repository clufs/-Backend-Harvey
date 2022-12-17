import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductsInCart } from './interface/productCart.interface';
import { Employee } from '../employee/entities/employee.entity';


@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) {}



  async create({ cart, ...rest }: CreateSaleDto, employee:Employee) {

    const {totalPrice, totalProfit} = await this.calculate(cart);

    try {
      
      const order = this.salesRepository.create({
        cart,
        totalPrice,
        totalProfit,
        ...rest,
        date: Date.now(),
        seller: employee
      });

      await this.salesRepository.save(order);

      delete order.totalProfit,
      delete order.cart;
      delete order.seller;

      return order

    } catch (error) {
      this.handleDbErrors(error);
    }
    
  }


  private async calculate(cart: ProductsInCart[]){
    
    let totalPrice: number = 0;
    let totalProfit: number = 0;
    let totalPriceToBuy: number = 0;

    for( let i = 0; i < cart.length ; i++){
      totalPrice += (await this.productRepository.findOneBy({id: cart[i].id})).priceToSell * cart[i].cant;
      totalPriceToBuy += (await this.productRepository.findOneBy({id: cart[i].id})).priceToBuy * cart[i].cant;
    }


    return {
      totalPrice,
      totalPriceToBuy,
      totalProfit: totalPrice - totalPriceToBuy
    };
    
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException(
      'Porfavor revisar los logs del servidor.',
    );
  }


}
