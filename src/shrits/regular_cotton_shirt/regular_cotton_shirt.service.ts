import { Injectable } from '@nestjs/common';
import { CreateRegularCottonShirtDto } from './dto/create-regular_cotton_shirt.dto';
import { UpdateRegularCottonShirtDto } from './dto/update-regular_cotton_shirt.dto';

@Injectable()
export class RegularCottonShirtService {
  create(createRegularCottonShirtDto: CreateRegularCottonShirtDto) {
    return 'This action adds a new regularCottonShirt';
  }

  findAll() {
    return `This action returns all regularCottonShirt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} regularCottonShirt`;
  }

  update(id: number, updateRegularCottonShirtDto: UpdateRegularCottonShirtDto) {
    return `This action updates a #${id} regularCottonShirt`;
  }

  remove(id: number) {
    return `This action removes a #${id} regularCottonShirt`;
  }
}
