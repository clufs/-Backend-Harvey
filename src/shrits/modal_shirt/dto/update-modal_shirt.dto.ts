import { PartialType } from '@nestjs/swagger';
import { CreateModalShirtDto } from './create-modal_shirt.dto';

export class UpdateModalShirtDto extends PartialType(CreateModalShirtDto) {}
