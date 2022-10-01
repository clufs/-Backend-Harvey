import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interface';

//Esto es para ver que nombre le pongo al "objeto" metadata donde estaran todos los roles 
export const META_ROLES = 'roles';

export const RolProtected = (...args: ValidRoles[]) => {

  return SetMetadata(META_ROLES, args)

};
