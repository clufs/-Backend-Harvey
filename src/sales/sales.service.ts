import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Employee } from '../employee/entities/employee.entity';
import { User } from '../auth/entities/user.entity';

import * as moment from 'moment-timezone';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create({ cart, ...rest }: any, employee: Employee) {
    const finalCart = cart.map((item) => JSON.parse(item));
    const { totalPrice, totalProfit } = await this.calculate(finalCart);

    const date = this.formatDay(new Date());
    const period = this.formatPeriod(new Date());

    try {
      const order = this.salesRepository.create({
        cart: cart,
        totalPrice,
        totalProfit,
        payment_method: rest.payment_method,
        date,
        period,
        seller: employee,
      });

      await this.salesRepository.save(order);

      delete order.totalProfit, delete order.cart;
      delete order.seller;

      return order;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private async calculate(cart: any) {
    let totalPrice: number = 0;
    let totalPriceToBuy: number = 0;

    for (let i = 0; i < cart.length; i++) {
      const price =
        (await this.productRepository.findOneBy({ id: cart[i].id }))
          .priceToSell * cart[i].cant;
      totalPrice += price;
      totalPriceToBuy +=
        (await this.productRepository.findOneBy({ id: cart[i].id }))
          .priceToBuy * cart[i].cant;
    }

    const discount = 500; //cada 5000

    const priceWhitDiscount = Math.floor(totalPrice / 5000) * discount;

    totalPrice = totalPrice - priceWhitDiscount;

    return {
      totalPrice,
      totalPriceToBuy,
      totalProfit: totalPrice - totalPriceToBuy,
    };
  }
  //FIXME: esto tenemos que ver que onda con el tiempo de busqueda.Si conviene pasarse a graphql.
  async getSalesEmpForDay(employee: Employee) {
    const today = this.formatDay(new Date());
    const sales = await this.salesRepository.find();
    const salesForEmp = sales.filter(
      (sales) => sales.date === today && sales.seller.id === employee.id,
    );
    const toSend = salesForEmp.map((e) => {
      return {
        id: e.id,
        payment_method: e.payment_method,
        total: e.totalPrice,
      };
    });

    return toSend;
  }

  //!ownergetAllSales
  async getSalesForDay(owner: User) {
    moment.tz.setDefault('America/Argentina/Buenos_Aires');
    const today = moment().format('DD/MM/YYYY');
    console.log('El dia de hoy es: ' + today);

    try {
      const { totalMonthIncome, totalMothProfits, totalIncome, totalProfits } =
        await this.getSales(owner);

      const allSales = await this.salesRepository.find();
      const sales = allSales.filter(
        (sale) => sale.seller.owner.id === owner.id && sale.date === today,
      );

      let todayTotalIncome = 0;
      let todayTotalProfits = 0;

      const salesToSend = sales.map(function (sale) {
        return {
          id: sale.id,
          payment_method: sale.payment_method,
          total: sale.totalPrice,
          profit: sale.totalProfit,
        };
      });

      sales.forEach(function (sale) {
        todayTotalIncome = todayTotalIncome + sale.totalPrice;
        todayTotalProfits = todayTotalProfits + sale.totalProfit;
      });

      return {
        salesToSend,

        todayTotalIncome,
        todayTotalProfits,

        totalMonthIncome,
        totalMothProfits,

        totalIncome,
        totalProfits,
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async getSales(owner: User): Promise<{
    totalMothProfits: number;
    totalMonthIncome: number;
    totalIncome: number;
    totalProfits: number;
  }> {
    moment.tz.setDefault('America/Argentina/Buenos_Aires');
    const currentPeriod = moment().format('MM/YYYY');
    console.log('La zona horaria es: ' + moment.tz.guess());
    console.log('El periodo actual es: ' + currentPeriod);

    let totalMothProfits = 0;
    let totalMonthIncome = 0;
    let totalIncome = 0;
    let totalProfits = 0;

    try {
      const allSales = await this.salesRepository.find();
      const sales = allSales.filter(
        (sale) =>
          sale.seller.owner.id === owner.id && sale.period === currentPeriod,
      );

      allSales.map((sale) => {
        if (sale.seller.owner.id === owner.id) {
          totalIncome += sale.totalPrice;
          totalProfits += sale.totalProfit;
        }
      });

      sales.forEach(function (sale) {
        totalMonthIncome = totalMonthIncome + sale.totalPrice;
        totalMothProfits = totalMothProfits + sale.totalProfit;
      });

      return {
        totalMonthIncome,
        totalMothProfits,
        totalIncome,
        totalProfits,
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async getSale({ id }: any, employee: Employee) {
    try {
      const sale = await this.salesRepository.findOneBy({ id: id });
      if (sale.seller.id === employee.id) {
        return {
          cart: sale.cart,
          total: sale.totalPrice,
        };
      }
    } catch (error) {
      this.handleDbErrors(error);
    }
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

  private formatDay(day: Date) {
    const yyyy = day.getFullYear();
    let mm = day.getMonth() + 1;
    let dd = day.getDate();

    if (dd < 10) dd = 0 + dd;
    if (mm < 10) mm = 0 + mm;

    return dd + '/' + mm + '/' + yyyy;
  }

  private formatPeriod(day: Date): string {
    const yyyy = day.getFullYear();
    let mm = day.getMonth() + 1;
    if (mm < 10) mm = 0 + mm;

    return mm + '/' + yyyy;
  }
}
