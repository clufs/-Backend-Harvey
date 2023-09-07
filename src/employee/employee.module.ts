import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ConfigModule } from '@nestjs/config';
import { SalesModule } from '../sales/sales.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Employee]),
    AuthModule,
    SalesModule,
    ProductsModule,
  ],
  exports: [TypeOrmModule, EmployeeService],
})
export class EmployeeModule {}
