import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModalShirtService } from './modal_shirt.service';
import { CreateModalShirtDto } from './dto/create-modal_shirt.dto';
import { UpdateModalShirtDto } from './dto/update-modal_shirt.dto';

@Controller('modal-shirt')
export class ModalShirtController {
  constructor(private readonly modalShirtService: ModalShirtService) {}

  @Post()
  create(@Body() createModalShirtDto: CreateModalShirtDto) {
    return this.modalShirtService.create(createModalShirtDto);
  }

  @Get()
  findAll() {
    return this.modalShirtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modalShirtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModalShirtDto: UpdateModalShirtDto) {
    return this.modalShirtService.update(+id, updateModalShirtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modalShirtService.remove(+id);
  }
}
