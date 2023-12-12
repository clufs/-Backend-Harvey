import { Injectable } from '@nestjs/common';
import { CreateModalShirtDto } from './dto/create-modal_shirt.dto';
import { UpdateModalShirtDto } from './dto/update-modal_shirt.dto';

@Injectable()
export class ModalShirtService {
  create(createModalShirtDto: CreateModalShirtDto) {
    return 'This action adds a new modalShirt';
  }

  findAll() {
    return `This action returns all modalShirt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modalShirt`;
  }

  update(id: number, updateModalShirtDto: UpdateModalShirtDto) {
    return `This action updates a #${id} modalShirt`;
  }

  remove(id: number) {
    return `This action removes a #${id} modalShirt`;
  }
}
