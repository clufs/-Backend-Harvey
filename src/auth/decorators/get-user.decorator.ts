import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if(!user) throw new InternalServerErrorException('usuario no encontrado en la req.');

    return (!data) ? user : user[data];

  }
);


