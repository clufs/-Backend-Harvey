import { Controller, Post, Body, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Employee } from '../employee/entities/employee.entity';
import { ValidRoles } from 'src/auth/interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaleResponse } from '../sales/interface/sale-reponse';
import { User } from '../auth/entities/user.entity';

@ApiTags('Ordenes')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Orden Creada con exito.',
    type: SaleResponse,
  })
  @Auth(ValidRoles.employee, ValidRoles.owner)
  create(@Body() createSaleDto: CreateSaleDto, @GetUser() employee: Employee) {
    return this.salesService.create(createSaleDto, employee);
  }

  @Get('get-sales-of-day-employee')
  @ApiResponse({
    status: 201,
    description: 'Ordenes obtenidas con exito.',
    type: SaleResponse,
  })
  @Auth(ValidRoles.employee)
  getSaleTodayOfEmployee(@GetUser() employee: Employee) {
    return this.salesService.getSalesEmpForDay(employee);
  }

  @Post('get-sale')
  @Auth(ValidRoles.employee)
  getOneSale(@Body() body, @GetUser() employee: Employee) {
    return this.salesService.getSale(body, employee);
  }

  @Post('get-sales-day')
  @Auth(ValidRoles.owner)
  getOneSalePerDay(@Body() body, @GetUser() owner: User) {
    return this.salesService.getSummaryOfOneDay(body, owner);
  }

  @Get('get-sales-today-owner')
  @Auth(ValidRoles.owner)
  getSalesTodayOwner(@GetUser() owner: User) {
    return this.salesService.getSalesForDay(owner);
  }

  @Get('get-sales-of-month-owner')
  @Auth(ValidRoles.owner)
  getSalesOfMonth(@GetUser() owner: User) {
    return this.salesService.getSales(owner);
  }

  @Get('summary-of-the-month')
  @Auth(ValidRoles.owner)
  getSummaryOfTheMonth(@GetUser() owner: User) {
    return this.salesService.getSummeryOfTheMonth(owner);
  }

  @Get('get-sales-details-of-month')
  @Auth(ValidRoles.owner)
  getSalesDetailsOfMonth(@GetUser() owner: User) {
    return this.salesService.getDaileSales(owner);
  }

  @Post('sales-of-one-month')
  @Auth(ValidRoles.owner)
  getSalesOfOneSingleMonth(@Body() body, @GetUser() owner: User) {
    return this.salesService.getSalesOfMonth(body, owner);
  }

  @Post('get-sales-by-period')
  @Auth(ValidRoles.owner)
  getSalesByPeriod(@GetUser() owner: User, @Body() body) {
    return this.salesService.getSalesByPeriod(body, owner);
  }
}
