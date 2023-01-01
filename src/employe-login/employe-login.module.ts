import { Module } from '@nestjs/common';
import { EmployeLoginService } from './employe-login.service';
import { EmployeLoginGateway } from './employe-login.gateway';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  providers: [EmployeLoginGateway, EmployeLoginService],
  imports: [
    EmployeeModule
  ],
})
export class EmployeLoginModule {}
