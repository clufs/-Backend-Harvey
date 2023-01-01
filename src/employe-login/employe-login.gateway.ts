import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm/repository/Repository';
import { Employee } from '../employee/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway({ cors: true })
export class EmployeLoginGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRespository: Repository<Employee>,
  ) {}

  async handleConnection(client: Socket) {
    console.log('Cliente conectado', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }

  @SubscribeMessage('register')
  async register(
    client: Socket,
    payload: { socket: string; name: string; token: string },
  ) {
    console.log(payload);
    this.wss.emit(`${payload.socket}`, {
      name: payload.name,
      token: payload.token,
      msg: 'anashe',
    });
  }
}
