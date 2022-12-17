import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm/repository/Repository';
import { Employee } from '../employee/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway({ cors: true })
export class EmployeLoginGateway implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRespository: Repository<Employee>,
    ) {}

  async handleConnection(client: Socket) {
    console.log('Cliente conectado', client.id);
    try {
      const employee = await this.employeeRespository.findOne({where: {socket: client.id}});
      console.log(employee.name);
    } catch (error) {
      console.log({error});
    }
  };

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }

  

}
