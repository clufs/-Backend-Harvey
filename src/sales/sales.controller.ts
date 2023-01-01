import { Controller, Post, Body, Get} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Employee } from '../employee/entities/employee.entity';
import { ValidRoles } from 'src/auth/interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaleResponse } from '../sales/interface/sale-reponse';

@ApiTags('Ordenes')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Orden Creada con exito.', type: SaleResponse })
  @Auth(ValidRoles.employee, ValidRoles.owner)

  create(
    @Body() createSaleDto: CreateSaleDto,
    @GetUser() employee: Employee,
    ){
    return this.salesService.create(createSaleDto, employee);
  };


  @Get('get-sales-of-day-employee')
  @ApiResponse({status: 201, description: 'Ordenes obtenidas con exito.', type: SaleResponse })
  @Auth()
  getSaleTodayOfEmployee(
    @GetUser() employee: Employee
  ){
    return this.salesService.getSalesEmpForDay(employee);
  }

  @Post('get-sale')
  @Auth()
  getOneSale(
    @Body() body,
    @GetUser() employee: Employee 
  ){
    return this.salesService.getSale(body, employee);
  }
}
