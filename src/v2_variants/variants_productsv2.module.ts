import { Module } from '@nestjs/common';
import { VariantsProductsv2Service } from './variants_productsv2.service';
import { VariantsProductsv2Controller } from './variants_productsv2.controller';
import { Productsv2Module } from '../v2_productsv2/productsv2.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VariantsProductsv2 } from './entities/variants_productsv2.entity';

@Module({
  controllers: [VariantsProductsv2Controller],
  providers: [VariantsProductsv2Service],
  exports: [VariantsProductsv2Service, TypeOrmModule],
  imports: [
    ConfigModule,
    Productsv2Module,
    TypeOrmModule.forFeature([VariantsProductsv2]),
  ],
})
export class VariantsProductsv2Module {}
