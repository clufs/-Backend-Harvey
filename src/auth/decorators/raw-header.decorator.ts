

import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;
    
  }
);


