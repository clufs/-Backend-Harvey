import { PartialType } from '@nestjs/swagger';
import { CreateTshirtDto } from './create-tshirt.dto';

export class UpdateTshirtDto extends PartialType(CreateTshirtDto) {}
