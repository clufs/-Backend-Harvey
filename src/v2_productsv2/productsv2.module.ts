import { Module } from '@nestjs/common';
import { Productsv2Service } from './productsv2.service';
import { Productsv2Controller } from './productsv2.controller';
// import { VariantsProductsv2Module } from '../v2_variants/variants_productsv2.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productsv2 } from './entities/productsv2.entity';
import { VariantsProductsv2 } from '../v2_variants/entities/variants_productsv2.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [Productsv2Controller],
  providers: [Productsv2Service],
  exports: [Productsv2Service, TypeOrmModule],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Productsv2, VariantsProductsv2]),
    // VariantsProductsv2Module,
  ],
})
export class Productsv2Module {}
