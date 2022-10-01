import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { RolProtected } from './decorators/rol-protected.decorator';
import { ValidRoles } from './interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  private3(@GetUser() user: User) {
    return {
      ok: true,
      path: 'private3',
      user,
    };
  }




















  

  // @Get('private')
  // @UseGuards( AuthGuard() ) //! Esto es configuracion no hace falta memorizarlo
  // testingPrivateRoute( //! Este es nombre del metodo.
  //   //?GetUser es un customDecorator tambien como esta configurado es de la libreria
  //   @Req() request: Express.Request,
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,

  //   @RawHeaders() rawHeader: string[]
  // ){

  //   console.log(rawHeader);

  //   return{
  //     ok: true,
  //     msg: 'Hola desde una ruta privada',
  //     user,
  //     userEmail,
  //     rawHeader
  //   }
  // };

  // // @SetMetadata('roles', ['admin', 'super-user'])
  // @Get('private2')
  // @RolProtected(ValidRoles.superUser, ValidRoles.admin)
  // @UseGuards( AuthGuard(), UserRoleGuard ) //Este no recive parentesis osea no se crea una instancia
  //       //* (auntenticacion, autorizacion)
  // private2(
  //   @GetUser() user: User
  // ){
  //   return {
  //     ok: true,
  //     user
  //   }
  // }
}
