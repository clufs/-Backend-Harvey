import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../entities/user.entity';
import { JwtPayload } from "../interface/jwt-payload.interface";
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Employee } from '../../employee/entities/employee.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    configService: ConfigService
  ){
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //! Esto decimos donde vamos a enviar el JWToken
    })
  }

  async validate(payload: JwtPayload){

    const {id} = payload;

    const owner = await this.userRepository.findOneBy({id});
    const employee = await this.employeeRepository.findOneBy({id});

    console.log(owner)

    
    if(!owner && !employee)         
    throw new UnauthorizedException('Token No valido');
    
    
    
    if( owner ) {
      if(!owner.isActive) throw new UnauthorizedException('Usuario no esta activo');
      return owner
    };
    if( employee ) return employee;
    
  };

};