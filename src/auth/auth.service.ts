import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //! (2) Esta es la injeccion:
    private readonly jwtServices: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log('ingreso al metodo.')


    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), //! Aca encryptamos el password
      }); //! Aca lo preparamos para insertar en la base de datos
      await this.userRepository.save(user);
      delete user.password; //! Aca borramos las mierdas.

      return {
        ...user,
        token: await this.getJWToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login({ phone, password }: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { phone }, //! Esta es la condicion que queremos que busque
      select: { email: true, password: true, id: true, fullName: true, company: true }, //! Esto es lo que configuramos para que retorne
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales no validas (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no validas (password)');
    }


    return {
      // email: user.email,
      fullName: user.fullName,
      company: user.company,
      token: await this.getJWToken({ id: user.id }),
    };
  };

  
  async getJWToken(payload: JwtPayload) {

    //! Para generar el token requiero un servicio que ya esta instalado,
    //! Para eso hacemos la injeeccion en el constructor paso ( (2) en la linea `23`)
    const token = this.jwtServices.sign(payload);
    return token;
  }

  async checkAuthStatus(user: User) {
    delete user.password;


    return {
      ...user,
      token: await this.getJWToken({ id: user.id }),
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
