import { Module } from '@nestjs/common';
import { Productv2Service } from './productv2.service';
import { Productv2Controller } from './productv2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productv2 } from './entities/productv2.entity';
import { Desing } from './entities/desings.entity';
import { Color } from './entities/colors.entity';
import { Size } from './entities/sizes.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PriceTier } from './entities/priceTier.entity';

@Module({
  controllers: [Productv2Controller],
  providers: [Productv2Service],
  imports: [
    TypeOrmModule.forFeature([Productv2, Desing, Color, Size, PriceTier]),
    AuthModule,
  ],
  exports: [Productv2Service, TypeOrmModule],
})
export class Productv2Module {}
