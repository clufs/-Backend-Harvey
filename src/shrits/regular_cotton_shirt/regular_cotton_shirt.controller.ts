import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegularCottonShirtService } from './regular_cotton_shirt.service';
import { CreateRegularCottonShirtDto } from './dto/create-regular_cotton_shirt.dto';
import { UpdateRegularCottonShirtDto } from './dto/update-regular_cotton_shirt.dto';

@Controller('regular-cotton-shirt')
export class RegularCottonShirtController {
  constructor(private readonly regularCottonShirtService: RegularCottonShirtService) {}

  @Post()
  create(@Body() createRegularCottonShirtDto: CreateRegularCottonShirtDto) {
    return this.regularCottonShirtService.create(createRegularCottonShirtDto);
  }

  @Get()
  findAll() {
    return this.regularCottonShirtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regularCottonShirtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegularCottonShirtDto: UpdateRegularCottonShirtDto) {
    return this.regularCottonShirtService.update(+id, updateRegularCottonShirtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regularCottonShirtService.remove(+id);
  }
}
