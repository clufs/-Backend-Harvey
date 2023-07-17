import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { V2SizesService } from './v2_sizes.service';
import { CreateV2SizeDto } from './dto/create-v2_size.dto';
import { UpdateV2SizeDto } from './dto/update-v2_size.dto';

@Controller('v2/sizes')
export class V2SizesController {
  constructor(private readonly v2SizesService: V2SizesService) {}

  @Post()
  create(@Body() createV2SizeDto: CreateV2SizeDto) {
    return this.v2SizesService.create(createV2SizeDto);
  }

  @Get()
  findAll() {
    return this.v2SizesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.v2SizesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateV2SizeDto: UpdateV2SizeDto) {
    return this.v2SizesService.update(+id, updateV2SizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.v2SizesService.remove(+id);
  }
}
