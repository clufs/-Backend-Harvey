import { Injectable } from '@nestjs/common';
import { CreateTshirtDto } from './dto/create-tshirt.dto';
import { UpdateTshirtDto } from './dto/update-tshirt.dto';

@Injectable()
export class TshirtService {
  create(createTshirtDto: CreateTshirtDto) {
    return 'This action adds a new tshirt';
  }

  findAll() {
    return `This action returns all tshirt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tshirt`;
  }

  update(id: number, updateTshirtDto: UpdateTshirtDto) {
    return `This action updates a #${id} tshirt`;
  }

  remove(id: number) {
    return `This action removes a #${id} tshirt`;
  }
}
