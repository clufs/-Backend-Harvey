import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HatsService } from './hats.service';
import { CreateHatDto } from './dto/create-hat.dto';
import { UpdateHatDto } from './dto/update-hat.dto';

@Controller('hats')
export class HatsController {
  constructor(private readonly hatsService: HatsService) {}

  @Post()
  create(@Body() createHatDto: CreateHatDto) {
    return this.hatsService.create(createHatDto);
  }

  @Get()
  findAll() {
    return this.hatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHatDto: UpdateHatDto) {
    return this.hatsService.update(+id, updateHatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hatsService.remove(+id);
  }
}
