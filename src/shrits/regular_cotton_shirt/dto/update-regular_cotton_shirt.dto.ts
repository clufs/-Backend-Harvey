import { PartialType } from '@nestjs/swagger';
import { CreateRegularCottonShirtDto } from './create-regular_cotton_shirt.dto';

export class UpdateRegularCottonShirtDto extends PartialType(CreateRegularCottonShirtDto) {}
