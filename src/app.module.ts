import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { EmployeeModule } from './employee/employee.module';
import { SalesModule } from './sales/sales.module';
import { EmployeLoginModule } from './employe-login/employe-login.module';

import { Productsv2Module } from './v2_productsv2/productsv2.module';
import { VariantsProductsv2Module } from './v2_variants/variants_productsv2.module';
import { V2SizesModule } from './v2_sizes/v2_sizes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl:
        process.env.STATE === 'prod'
          ? { rejectUnauthorized: false, sslmode: 'require' }
          : (false as any),
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,

    ProductsModule,

    EmployeeModule,

    SalesModule,

    EmployeLoginModule,

    Productsv2Module,

    VariantsProductsv2Module,

    V2SizesModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('STATE', process.env.STATE);
    console.log('host', process.env.DB_HOST);
    console.log('port', +process.env.DB_PORT);
    console.log('database', process.env.DB_NAME);
    console.log('username', process.env.DB_USERNAME);
    console.log('password', process.env.DB_PASSWORD);
  }
}
