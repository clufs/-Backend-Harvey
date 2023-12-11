import { Injectable } from '@nestjs/common';
import { CreateHatDto } from './dto/create-hat.dto';
import { UpdateHatDto } from './dto/update-hat.dto';

@Injectable()
export class HatsService {
  create(createHatDto: CreateHatDto) {
    return 'This action adds a new hat';
  }

  findAll() {
    return `This action returns all hats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hat`;
  }

  update(id: number, updateHatDto: UpdateHatDto) {
    return `This action updates a #${id} hat`;
  }

  remove(id: number) {
    return `This action removes a #${id} hat`;
  }
}
