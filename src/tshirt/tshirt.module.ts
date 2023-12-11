import { Module } from '@nestjs/common';
import { TshirtService } from './tshirt.service';
import { TshirtController } from './tshirt.controller';

@Module({
  controllers: [TshirtController],
  providers: [TshirtService]
})
export class TshirtModule {}
