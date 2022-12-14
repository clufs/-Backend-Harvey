import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Sale]),
    AuthModule,
    ProductsModule
  ],
  exports: [
    TypeOrmModule,
    SalesService
  ]

})

export class SalesModule {}
