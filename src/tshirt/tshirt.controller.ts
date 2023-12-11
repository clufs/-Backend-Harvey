import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TshirtService } from './tshirt.service';
import { CreateTshirtDto } from './dto/create-tshirt.dto';
import { UpdateTshirtDto } from './dto/update-tshirt.dto';

@Controller('tshirt')
export class TshirtController {
  constructor(private readonly tshirtService: TshirtService) {}

  @Post()
  create(@Body() createTshirtDto: CreateTshirtDto) {
    return this.tshirtService.create(createTshirtDto);
  }

  @Get()
  findAll() {
    return this.tshirtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tshirtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTshirtDto: UpdateTshirtDto) {
    return this.tshirtService.update(+id, updateTshirtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tshirtService.remove(+id);
  }
}
