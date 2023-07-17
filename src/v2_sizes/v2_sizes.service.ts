import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateV2SizeDto } from './dto/create-v2_size.dto';
import { UpdateV2SizeDto } from './dto/update-v2_size.dto';
import { V2Size } from './entities/v2_size.entity';
import { Repository } from 'typeorm';
import { VariantsProductsv2 } from '../v2_variants/entities/variants_productsv2.entity';

@Injectable()
export class V2SizesService {
  constructor(
    @InjectRepository(V2Size)
    private readonly sizesRepository: Repository<V2Size>,

    @InjectRepository(VariantsProductsv2)
    private readonly variantsRepository: Repository<VariantsProductsv2>,
  ) {}

  async create(createV2SizeDto: CreateV2SizeDto) {
    try {
      const { mainVariantId, ...rest } = createV2SizeDto;

      const variant = await this.variantsRepository.findOne({
        where: {
          id: mainVariantId,
        },
        relations: {
          main: true,
        },
      });

      const size = this.sizesRepository.create({
        ...rest,
        mainVariant: variant,
      });

      await this.sizesRepository.save(size);

      return {
        ok: true,
        size,
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  findAll() {
    return `This action returns all v2Sizes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} v2Size`;
  }

  update(id: number, updateV2SizeDto: UpdateV2SizeDto) {
    return `This action updates a #${id} v2Size`;
  }

  remove(id: number) {
    return `This action removes a #${id} v2Size`;
  }
  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException(
      'Porfavor revisar los logs del servidor.',
    );
  }
}
