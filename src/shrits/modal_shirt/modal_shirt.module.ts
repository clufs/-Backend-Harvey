import { Module } from '@nestjs/common';
import { ModalShirtService } from './modal_shirt.service';
import { ModalShirtController } from './modal_shirt.controller';

@Module({
  controllers: [ModalShirtController],
  providers: [ModalShirtService]
})
export class ModalShirtModule {}
