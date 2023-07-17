import { Module } from '@nestjs/common';
import { V2SizesService } from './v2_sizes.service';
import { V2SizesController } from './v2_sizes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { V2Size } from './entities/v2_size.entity';
import { VariantsProductsv2Module } from '../v2_variants/variants_productsv2.module';

@Module({
  controllers: [V2SizesController],
  providers: [V2SizesService],
  exports: [V2SizesService, TypeOrmModule],
  imports: [
    ConfigModule,
    AuthModule,
    VariantsProductsv2Module,
    TypeOrmModule.forFeature([V2Size]),
  ],
})
export class V2SizesModule {}
