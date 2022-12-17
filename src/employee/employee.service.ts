import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { AuthService } from '../auth/auth.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from '../auth/interface/valid-roles.interface';
import { Product } from 'src/products/entities/product.entity';
import { identity } from 'rxjs';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRespository: Repository<Employee>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly authService: AuthService,
  ) {}

  async create(owner: User, employee: CreateEmployeeDto) {
    const { name, socket } = employee;

    try {
      const newEmp = this.employeeRespository.create({
        owner,
        name,
        socket,
      });

      await this.employeeRespository.save(newEmp);
      return {
        newEmp,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }

  };

  async getAllSellers(owner: User){
    try {
      const employees = await this.employeeRespository.find();
      const myemps = employees.filter((emp) => emp.owner.id  === owner.id);
      return myemps;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  };


  async toggleStatusSeller(owner: User, body:{sellerId: string}){
    console.log('entro en el toogle');
    console.log(body);
    try {
      const seller = await this.employeeRespository.findOne({
        where: {id: body.sellerId}
      });
      
      if(owner.id == seller.owner.id){
        console.log('ingreso al ternario');
        seller.isActive = !seller.isActive;
      };

      await this.employeeRespository.save(seller);


    } catch (error) {
      this.handleDBExceptions(error);
    }
  };




















  async login({ password, phone }: LoginEmployeeDto) {
    // const user = await this.employeeRespository.findOne({
    //   where: { phone }, //! Esta es la condicion que queremos que busque
    //   select: {  password: true, id: true, company: true }, //! Esto es lo que configuramos para que retorne
    // });

    // if (!user) {
    //   throw new UnauthorizedException('Credenciales no validas (telefono)');
    // }

    // if (!bcrypt.compareSync(password, user.password)) {
    //   throw new UnauthorizedException('Credenciales no validas (password)');
    // }

    return {
      // token: await this.authService.getJWToken({ id: user.id }),
      // user,
    };
  }

  @Auth(ValidRoles.employee)
  async findAllProducts(employee: Employee) {
    try {
      const products = await this.productRepository.find();
      const productsToShow = products.filter(
        (product) => product.user.id == employee.owner.id,
      );
      return productsToShow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error.code);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    )

    
  }
}
