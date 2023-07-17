import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVariantsProductsv2Dto } from './dto/create-variants_productsv2.dto';
import { UpdateVariantsProductsv2Dto } from './dto/update-variants_productsv2.dto';
import { Productsv2 } from 'src/v2_productsv2/entities/productsv2.entity';
import { Repository } from 'typeorm';
import { VariantsProductsv2 } from './entities/variants_productsv2.entity';

@Injectable()
export class VariantsProductsv2Service {
  constructor(
    @InjectRepository(Productsv2)
    private readonly v2_productRepository: Repository<Productsv2>,
    @InjectRepository(VariantsProductsv2)
    private readonly v2_variantsRepository: Repository<VariantsProductsv2>,
  ) {}

  async create(createVariantsProductsv2Dto: CreateVariantsProductsv2Dto) {
    const { mainProductId, ...rest } = createVariantsProductsv2Dto;

    try {
      const mainProduct = await this.v2_productRepository.findOne({
        where: { id: mainProductId },
      });

      const variant = this.v2_variantsRepository.create({
        ...rest,
        main: mainProduct,
      });

      await this.v2_variantsRepository.save(variant);

      return {
        ok: true,
        variant,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all variantsProductsv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variantsProductsv2`;
  }

  update(id: number, updateVariantsProductsv2Dto: UpdateVariantsProductsv2Dto) {
    return `This action updates a #${id} variantsProductsv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} variantsProductsv2`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    );
  }
}
