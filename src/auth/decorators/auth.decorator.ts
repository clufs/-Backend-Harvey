import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interface';
import { RolProtected } from './rol-protected.decorator';

export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );

}