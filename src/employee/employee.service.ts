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
import { JwtService } from '@nestjs/jwt';
import { userInfo } from 'os';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRespository: Repository<Employee>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly authService: AuthService,
    private readonly jwtServices: JwtService,
  ) {}

  async create(owner: User, employee: CreateEmployeeDto) {
    console.log(employee);

    try {
      const newEmp = this.employeeRespository.create({
        owner,
        password: bcrypt.hashSync(employee.password, 10),
        ...employee,
      });

      await this.employeeRespository.save(newEmp);

      delete employee.password; //! Aca borramos las mierdas.

      return {
        newEmp,
        token: await this.authService.getJWToken({ id: newEmp.id }),
      };
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async getAllSellers(owner: User) {
    try {
      const employees = await this.employeeRespository.find();
      const myemps = employees.filter((emp) => emp.owner.id === owner.id);
      return myemps;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getSeller(owner: User, body: { sellerId: string }) {
    try {
      const seller = await this.employeeRespository.findOne({
        where: { id: body.sellerId },
      });

      if (owner.id == seller.owner.id) {
        return seller;
      }
    } catch (error) {}
  }

  async toggleStatusSeller(owner: User, body: { sellerId: string }) {
    console.log('entro en el toogle');
    console.log(body);
    try {
      const seller = await this.employeeRespository.findOne({
        where: { id: body.sellerId },
      });

      if (owner.id == seller.owner.id) {
        console.log('ingreso al ternario');
        seller.isActive = !seller.isActive;
      }

      await this.employeeRespository.save(seller);

      return seller;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login({ password, phone }: LoginEmployeeDto) {
    const employe = await this.employeeRespository.findOne({
      where: { phone , password},
      select: {
        id: true,
        isActive: true,
        name: true,
      },
    });

    if(!employe){
      throw new UnauthorizedException('Crendenciales no validas.');      
    }

    return {
      fullname: employe.name,
      token: await this.authService.getJWToken({id: employe.id})
    }




    // return {
    //   token: await this.authService.getJWToken({ id: employee.id }),
    //   // employee,
    // };
  }

  async checkAuthStatus(emp: Employee) {
    delete emp.password;

    return {
      ...emp,
      token: await this.authService.getJWToken({ id: emp.id }),
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

  @Auth(ValidRoles.employee)
  async findProduct(employee: Employee, body: {code: string}){

    try {
      const products:Product[] = await this.productRepository.find();
      const product = products.find((prod) => prod.user.id === employee.owner.id && prod.code === body.code);

      const productToSend = {
        id: product.id,
        price: product.priceToSell,
        name: product.title,
      };

      return product === undefined ? {notFound: true} : productToSend;

    } catch (error) {
      console.log('Algo salio mal revisar logs');
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error.code);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    );
  }
}
