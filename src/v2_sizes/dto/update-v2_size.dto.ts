import { PartialType } from '@nestjs/swagger';
import { CreateV2SizeDto } from './create-v2_size.dto';

export class UpdateV2SizeDto extends PartialType(CreateV2SizeDto) {}
