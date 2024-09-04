import { Module } from '@nestjs/common';
import { Productv2Service } from './productv2.service';
import { Productv2Controller } from './productv2.controller';

@Module({
  controllers: [Productv2Controller],
  providers: [Productv2Service]
})
export class Productv2Module {}
