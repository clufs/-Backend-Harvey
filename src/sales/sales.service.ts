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

import moment from 'moment-timezone';
import { ProductsInCart } from './interface/productCart.interface';

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

  async create(body: any, employee: Employee) {
    const { cart, cardType, ...rest } = body;
    const finalCart = cart.map((item) => JSON.parse(item));
    const { totalPrice, totalProfit } = await this._calculate(
      finalCart,
      cardType,
    );

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

      await Promise.all([
        this._updateProductStock(cart),
        this.salesRepository.save(order),
      ]);

      const {
        todayTotalIncome,
        todayTotalProfits,
        todayTotalTarj,
        todayTotalEfec,
        todayTotalTranf,
      } = await this.getSalesForDay(employee.owner);

      const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
      });

      //       const toSendWhatsapp = `
      //               *Nueva venta!* 📦
      // *Metodo de pago*: ${order.payment_method}
      // *Total*: *${formatter.format(order.totalPrice)}*
      // *Ganancia*: *${formatter.format(order.totalProfit)}*

      // *${date}*
      // *Total*: *${formatter.format(todayTotalIncome)}*\n
      // *Ganancia*: *${formatter.format(todayTotalProfits)}*\n

      // *Tarjeta*: *${formatter.format(todayTotalTarj)}*\n
      // *Efectivo*: *${formatter.format(todayTotalEfec)}*\n
      // *Transferencia*: *${formatter.format(todayTotalTranf)}*\n
      //       `;

      // await this._seedMessage(employee.owner.phone, toSendWhatsapp);

      delete order.totalProfit, delete order.cart;
      delete order.seller;

      return order;
    } catch (error) {
      console.log(error);
      this.handleDbErrors(error);
    }
  }

  private async _updateProductStock(cart) {
    // Obtener los productos en el carrito
    const productsInCart: ProductsInCart[] = cart.map((product) =>
      JSON.parse(product),
    );
    console.log(productsInCart);

    // Actualizar el stock de cada producto en el carrito
    for (const productInCart of productsInCart) {
      // Obtener el producto

      const product = await this.productRepository.findOne({
        where: { id: productInCart.id },
      });

      // Actualizar el stock del producto
      product.stock -= productInCart.cant;

      console.log(product);

      await this.productRepository.save(product);
    }
  }

  private async _calculate(cart: any, cardType: string) {
    const debitImp = 0.0335;
    const creditImp = 0.0179;
    const iibb = 0.03;
    const sirtac = 0.03;

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

    if (cardType) {
      if (cardType == 'debit')
        totalProfit = Math.round(
          totalPrice - totalPriceToBuy - impuestoTotalDebito,
        );
      if (cardType == 'credit')
        totalProfit = Math.round(
          totalPrice - totalPriceToBuy - impuestoTotalCredito,
        );
    } else {
      totalProfit = Math.round(totalPrice - totalPriceToBuy);
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
  }

  //Obtener Resumen del dia
  async getResumeOfDay(owner: User, day: string) {
    const sales = await this.salesRepository.find();

    const salesOfDay = sales.filter(
      (sales) => sales.date === day && sales.seller.owner.id === owner.id,
    );
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

      let todayTotalTarj = 0;
      let todayTotalTranf = 0;
      let todayTotalEfec = 0;

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
        switch (sale.payment_method) {
          case 'tarjeta':
            todayTotalTarj += sale.totalPrice;
            break;
          case 'efectivo':
            todayTotalEfec += sale.totalPrice;
            break;
          case 'deposito':
            todayTotalTranf += sale.totalPrice;
            break;
        }
      });

      return {
        salesToSend,
        // esto es hoy
        todayTotalIncome,
        todayTotalProfits,
        todayTotalTarj,
        todayTotalEfec,
        todayTotalTranf,

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

    const period = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('M/YYYY');

    const { finalSales, allSales } = await this._getSalesOfMonth(period, owner);

    const aa: Sale[] = finalSales;

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
          cantidadRepetida[producto.name].total +=
            producto.cant * producto.price;
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
    let subTotal = 0;
    obj.forEach((a) => {
      subTotal += a.total;
    });

    const { cardSale, cashSale, transfSale } = await this._calculateTypeSale(
      allSales,
    );
    console.log(obj);

    return {
      total: totalMonthIncome,
      profits: totalMothProfits,
      cardSale,
      transfSale,
      cashSale,

      sales: obj,
    };
  }

  async getSummaryOfOneDay(body: any, owner: User) {
    const { date } = body;

    const { finalSales, sales: allSales } = await this._getSalesOfDay(
      date,
      owner,
    );

    const sales = allSales.filter((sale) => sale.seller.owner.id === owner.id);

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
          cantidadRepetida[producto.name].total +=
            producto.cant * producto.price;
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
    let subTotal = 0;
    obj.forEach((a) => {
      subTotal += a.total;
    });

    const { cardSale, cashSale, transfSale } = await this._calculateTypeSale(
      sales,
    );

    console.log(owner.phone);

    const {
      todayTotalIncome,
      todayTotalProfits,
      todayTotalTarj,
      todayTotalEfec,
      todayTotalTranf,
    } = await this.getSalesForDay(owner);

    //TODO: ACa tenemos que arregalr esto y colocarlo en la mierda de creacion de orden
    // *ID*: ${order.id}\n
    // *Metodo de pago*: _${order.payment_method}_\n
    // *Total*: *$${order.totalPrice.toFixed(2)}*\n
    // *Ganancia*: *$${order.totalProfit.toFixed(2)}*\n

    // *$${date}*\n
    // *total*: *$${todayTotalIncome.toFixed(2)}*\n
    // *Ganancia*: *$${todayTotalProfits.toFixed(2)}*\n
    //     const toSendWhatsapp = `
    //                        *Nueva venta!* 📦\n
    //                        ---------------------------------
    // *Tarjeta*: $${todayTotalTarj}\n*Efectivo*: $${todayTotalEfec}\n*Transferencia*: $${todayTotalTranf}\n
    //     `;

    //     await this._seedMessage(owner.phone, toSendWhatsapp);

    return {
      subTotal,
      cardSale,
      transfSale,
      cashSale,
      sales: obj.sort((a, b) => b.total - a.total),
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

  private async _getSalesOfDay(day: string, owner: User) {
    const sales = await this.salesRepository.find({
      select: [
        'cart',
        'totalPrice',
        'totalProfit',
        'payment_method',
        'date',
        'seller',
      ],
      where: {
        date: day,
      },
    });

    let finalSales = [];

    sales.map((sale) => {
      // delete sale.seller;
      if (sale.seller.owner.id === owner.id) {
        finalSales.push(sale.cart.map((item) => JSON.parse(item)));
      }
    });

    console.log(finalSales, sales);

    return { finalSales, sales };
  }

  async getSalesOfMonth(body: any, owner: User) {
    const { period } = body;

    const { allSales, finalSales } = await this._getSalesOfMonth(period, owner);

    const tranfSales = [];
    const cardSales = [];
    const cashSales = [];

    let totalProfit = 0;

    let totalTranfsSales = 0;
    let totalCardSales = 0;
    let totalCashSales = 0;

    allSales.map((sale) => {
      if (sale.payment_method === 'efectivo') {
        cashSales.push(sale);
        totalCashSales += sale.totalPrice;
        totalProfit += sale.totalProfit;
        return;
      }
      if (sale.payment_method === 'deposito') {
        tranfSales.push(sale);
        totalTranfsSales += sale.totalPrice;
        totalProfit += sale.totalProfit;
        return;
      }
      if (sale.payment_method === 'tarjeta') {
        cardSales.push(sale);
        totalCardSales += sale.totalPrice;
        totalProfit += sale.totalProfit;
        return;
      }
    });

    return {
      totalCardSales,
      totalTranfsSales,
      totalCashSales,
      spacin1: '----',

      total: totalCardSales + totalTranfsSales + totalCashSales,
      totalProfit,
      spacin: '----',

      tranfSales,
      cardSales,
      cashSales,
    };
  }

  private async _getSalesOfMonth(period: string, owner: User) {
    let finalSales = [];
    let allSales = [];

    const sales = await this.salesRepository.find({
      select: [
        'cart',
        'totalPrice',
        'totalProfit',
        'payment_method',
        'date',
        'seller',
      ],
      where: {
        period: period,
      },
    });

    sales.map((sale) => {
      // delete sale.seller;
      if (sale.seller.owner.id === owner.id) {
        finalSales.push(sale.cart.map((item) => JSON.parse(item)));
        allSales.push(sale);
      }
    });

    sales.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return { finalSales, allSales };
  }

  async getDaileSales(owner: User) {
    const period = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('M/YYYY');

    console.log(owner.id);

    // const period = '7/2024';
    const { allSales, finalSales } = await this._getSalesOfMonth(period, owner);

    console.log(allSales);

    const sales = allSales.filter((sale) => sale.seller.owner.id === owner.id);

    console.log(sales);

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

    const sortedSellForDayOnCurrentMonth = Object.keys(SellForDayOnCurrentMonth)
      .sort(
        (a, b) =>
          moment(a, 'YYYY-MM-DD').unix() - moment(b, 'YYYY-MM-DD').unix(),
      )
      .reduce((obj, key) => {
        obj[key] = SellForDayOnCurrentMonth[key];
        return obj;
      }, {});

    //TODO: Esta es la funcion que tenemmos que cambiar para que se ordene correctamente las fechas.

    console.log(SellForDayOnCurrentMonth);

    return sortedSellForDayOnCurrentMonth;
  }

  private async _seedMessage(to: string, message: string) {
    const whatsappApiUrl =
      'https://graph.facebook.com/v20.0/389577380911238/messages';
    const token =
      'EAAKGZAsfbDmYBO39JZAVUZC7ZBRMf8bTZCkyKfKuq9GZABYkPZAJQQQTPvBvQUCnZAtqF24x7ZCZAEecJ12MDhlkEI5qYTQJfua2ZB371RSzruCNbUMVS7AWF5vSlwmdC2xBz5WvkcTfYU8yhbZBKEFYAPtKRjBM1zzay6ex0t0ffZAAxhlF5W2ayYCOu7aj7duRZCy3RPJOLrCkIzK25pib1jo7LYsfzunOwZD';
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `+54${to}`, // Asegúrate de usar el formato correcto del número
      type: 'text',
      text: {
        preview_url: true,
        body: message,
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error sending WhatsApp message: ${JSON.stringify(errorData)}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.message);
      throw error;
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
}
