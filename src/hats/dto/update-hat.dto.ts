import { PartialType } from '@nestjs/swagger';
import { CreateHatDto } from './create-hat.dto';

export class UpdateHatDto extends PartialType(CreateHatDto) {}
