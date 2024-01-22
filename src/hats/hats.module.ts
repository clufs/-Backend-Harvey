import { Module } from '@nestjs/common';
import { HatsService } from './hats.service';
import { HatsController } from './hats.controller';

@Module({
  controllers: [HatsController],
  providers: [HatsService]
})
export class HatsModule {}
