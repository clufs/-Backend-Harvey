import { Module } from '@nestjs/common';
import { RegularCottonShirtService } from './regular_cotton_shirt.service';
import { RegularCottonShirtController } from './regular_cotton_shirt.controller';

@Module({
  controllers: [RegularCottonShirtController],
  providers: [RegularCottonShirtService]
})
export class RegularCottonShirtModule {}
