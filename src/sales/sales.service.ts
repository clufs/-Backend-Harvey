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
import { CardType, CreateSaleDto } from './dto/create-sale.dto';

interface TypeOfSale {
  cardSale: number;
  transfSale: number;
  cashSale: number;
}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create({ cart, card, ...rest }: any, employee: Employee) {
    const finalCart = cart.map((item) => JSON.parse(item));
    const { totalPrice, totalProfit } = await this._calculate(finalCart, card);

    const date = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('D/M/YYYY');

    const period = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('M/YYYY');

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

  private async _calculate(cart: any, card: CardType) {
    const debitImp = parseFloat(process.env.DEBIT_MP);
    const creditImp = parseFloat(process.env.CREDIT_MP);
    const iibb = parseFloat(process.env.IIBB);
    const sirtac = parseFloat(process.env.SIRTAC);

    const finalImpCredit = creditImp + iibb + sirtac;
    const finalImpDebit = debitImp + iibb + sirtac;

    let totalPrice: number = 0;
    let totalPriceToBuy: number = 0;
    let totalProfit: number = 0;

    for (let i = 0; i < cart.length; i++) {
      const price =
        (await this.productRepository.findOneBy({ id: cart[i].id }))
          .priceToSell * cart[i].cant;
      totalPrice += price;
      totalPriceToBuy +=
        (await this.productRepository.findOneBy({ id: cart[i].id }))
          .priceToBuy * cart[i].cant;
    }

    const impuestoTotalCredito = totalPrice * finalImpCredit;
    const impuestoTotalDebito = totalPrice * finalImpDebit;

    switch (card) {
      case 'debit':
        totalProfit = totalPrice - totalPriceToBuy - impuestoTotalDebito;
        break;
      case 'credit':
        totalProfit = totalPrice - totalPriceToBuy - impuestoTotalCredito;
        break;
    }

    return {
      totalPrice,
      totalPriceToBuy,
      totalProfit,
    };
  }
  //FIXME: esto tenemos que ver que onda con el tiempo de busqueda.Si conviene pasarse a graphql.
  async getSalesEmpForDay(employee: Employee) {
    let totalCard = 0;
    let totalTransf = 0;
    let totalCash = 0;

    const today = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('D/M/YYYY');
    const sales = await this.salesRepository.find();
    const salesForEmp = sales.filter(
      (sales) => sales.date === today && sales.seller.id === employee.id,
    );

    salesForEmp.forEach((sale) => {
      switch (sale.payment_method) {
        case 'tarjeta':
          totalCard += sale.totalPrice;
          break;
        case 'efectivo':
          totalCash += sale.totalPrice;
          break;
        case 'deposito':
          totalTransf += sale.totalPrice;
          break;
      }
    });

    const toSend = salesForEmp.map((e) => {
      return {
        id: e.id,
        payment_method: e.payment_method,
        total: e.totalPrice,
      };
    });

    return toSend;

    // return {
    //   toSend,
    //   totalCard,
    //   totalCash,
    //   totalTransf,
    // };
  }

  //!ownergetAllSales
  async getSalesForDay(owner: User) {
    const today = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('D/M/YYYY');
    const hour = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('HH:mm:ss');
    console.log('El dia de hoy es: ' + today + hour);

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
    const currentPeriod = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('M/YYYY');
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

  async getSummeryOfTheMonth(owner: User) {
    const { totalMonthIncome, totalMothProfits } = await this.getSales(owner);

    const { finalSales, sales } = await this._getSalesOfMonth();

    const cantidadRepetida: {
      [name: string]: {
        id: string;
        name: string;
        cant: number;
        total: number;
        profits?: number;
      };
    } = {};

    finalSales.forEach((subcategory) => {
      subcategory.forEach((producto) => {
        if (producto.name in cantidadRepetida) {
          (cantidadRepetida[producto.name].name = producto.name),
            (cantidadRepetida[producto.name].id = producto.id),
            (cantidadRepetida[producto.name].cant += producto.cant);
          // cantidadRepetida[producto.name].total +=
          //FIXME: producto.cant * ;
        } else {
          cantidadRepetida[producto.name] = {
            name: producto.name,
            id: producto.id,
            cant: producto.cant,
            total: producto.cant * producto.price,
            //FIXME: profits: producto.cant *
          };
        }
      });
    });

    const obj = Object.entries(cantidadRepetida).map(
      ([name, { id, cant, total, profits }]) => ({
        name,
        id,
        cant,
        total,
        profits,
      }),
    );
    //TODO: anaseh
    let subtotla = 0;
    obj.forEach((a) => {
      subtotla += a.total;
    });

    console.log(subtotla);

    const { cardSale, cashSale, transfSale } = await this._calculateTypeSale(
      sales,
    );

    return {
      total: totalMonthIncome,
      profits: totalMothProfits,
      cardSale,
      transfSale,
      cashSale,

      sales: obj,
    };
  }

  private async _calculateTypeSale(sales: Sale[]): Promise<TypeOfSale> {
    let cardSale = 0;
    let cashSale = 0;
    let transfSale = 0;

    sales.forEach((sale) => {
      const totalPrice = +sale.totalPrice;
      if (sale.payment_method == 'efectivo') cashSale += totalPrice;
      if (sale.payment_method == 'tarjeta') cardSale += totalPrice;
      if (sale.payment_method == 'deposito') transfSale += totalPrice;
    });

    return {
      cardSale,
      cashSale,
      transfSale,
    };
  }

  private async _getSalesOfMonth() {
    const period = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('M/YYYY');

    const sales = await this.salesRepository.find({
      select: ['cart', 'totalPrice', 'totalProfit', 'payment_method', 'date'],
      where: {
        period: period,
      },
    });
    let finalSales = [];

    sales.map((sale) => {
      delete sale.seller;
      finalSales.push(sale.cart.map((item) => JSON.parse(item)));
    });

    console.log(finalSales, sales);

    return { finalSales, sales };
  }

  async getDaileSales() {
    const { sales } = await this._getSalesOfMonth();

    const SellForDayOnCurrentMonth: {
      [date: string]: {
        total: number;
        profits: number;
      };
    } = {};

    sales.forEach((sale) => {
      if (sale.date in SellForDayOnCurrentMonth) {
        SellForDayOnCurrentMonth[sale.date].profits += sale.totalProfit;
        SellForDayOnCurrentMonth[sale.date].total += sale.totalPrice;
      } else {
        SellForDayOnCurrentMonth[sale.date] = {
          profits: sale.totalProfit,
          total: sale.totalPrice,
        };
      }
    });

    return SellForDayOnCurrentMonth;
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
