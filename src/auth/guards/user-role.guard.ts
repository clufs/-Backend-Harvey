import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/rol-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler() );

    //! Esto es si queremos dejar pasar a cualquiera al endpoint.
    if(!validRoles) return true;
    if(validRoles.length === 0) return true;

    //Aca rescatamos el usuario.
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    //SI no lo encontramos.
    if(!user) throw new BadRequestException('Usuario no Encontrado');

    //buscamos si es permitido el rol que posee el usuario.
    for( const role of user.roles ){
      if(validRoles.includes(role)) return true;
    }

    //error si no tiene el rol incluido
    throw new ForbiddenException(
      `El usuario: ${user.fullName} necesita un rol determinado [${validRoles}], Rol actual: ${user.roles}`
    )
    
  }
}
