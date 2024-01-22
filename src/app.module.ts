import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { EmployeeModule } from './employee/employee.module';
import { SalesModule } from './sales/sales.module';
import { EmployeLoginModule } from './employe-login/employe-login.module';
import { HatsModule } from './hats/hats.module';
import { ModalShirtModule } from './shrits/modal_shirt/modal_shirt.module';
import { RegularCottonShirtModule } from './shrits/regular_cotton_shirt/regular_cotton_shirt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // ssl: false, //TODO: esto tengo que ver que onda con la mierda de ssl
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

    HatsModule,

    ModalShirtModule,

    RegularCottonShirtModule,
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
