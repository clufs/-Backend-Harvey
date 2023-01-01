import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from '../auth/interface/valid-roles.interface';
import { User } from '../auth/entities/user.entity';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { Employee } from './entities/employee.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Auth(ValidRoles.owner)
  create(@GetUser() owner: User, @Body() empoyee: CreateEmployeeDto) {
    return this.employeeService.create(owner, empoyee);
  }

  @Post('login')
  login( @Body() loginUserDto: LoginEmployeeDto) {
    return this.employeeService.login(loginUserDto);
  }

  @Auth(ValidRoles.owner)
  @Post('get-seller')
  getSeller(@GetUser() owner: User, @Body() body: { sellerId: string }) {
    return this.employeeService.getSeller(owner, body);
  }

  @Auth(ValidRoles.owner)
  @Get()
  getAllSellers(@GetUser() owner: User) {
    return this.employeeService.getAllSellers(owner);
  }

  @Auth(ValidRoles.owner)
  @Post('toggleActiveSeller')
  toogleSellerStatus(
    @GetUser() owner: User,
    @Body() body: { sellerId: string },
  ) {
    return this.employeeService.toggleStatusSeller(owner, body);
  }

  @Auth(ValidRoles.employee)
  @Get('products')
  getProducts(@GetUser() employee: Employee) {
    return this.employeeService.findAllProducts(employee);
  }

  @Auth(ValidRoles.employee)
  @Post('get-product')
  getProduct(@GetUser() employee: Employee, @Body() body:{ code: string}){
    return this.employeeService.findProduct(employee, body);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() emp: Employee) {
    return this.employeeService.checkAuthStatus(emp);
  }
}
