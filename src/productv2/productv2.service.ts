import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductv2Dto } from './dto/create-productv2.dto';
import { UpdateProductv2Dto } from './dto/update-productv2.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Productv2 } from './entities/productv2.entity';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';
import { PriceTier } from './entities/priceTier.entity';

@Injectable()
export class Productv2Service {
  constructor(
    @InjectRepository(Productv2)
    private readonly productRepository: Repository<Productv2>,
  ) {}

  @Auth(ValidRoles.owner)
  async create(createProductv2Dto: CreateProductv2Dto, user: User) {
    const { priceToBuy } = createProductv2Dto;

    // Mapear los DTOs de PriceTier a entidades de PriceTier
    const priceTiers = createProductv2Dto.priceTiers.map((priceTierDto) => {
      const priceTier = new PriceTier();
      priceTier.minQuantity = priceTierDto.minQuantity;
      priceTier.price = priceTierDto.price;
      return priceTier;
    });

    try {
      const product = this.productRepository.create({
        ...createProductv2Dto,
        user,
        priceTiers,
      });

      // product.profit = priceToSell - priceToBuy;

      await this.productRepository.save(product);

      return {
        product,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all productv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productv2`;
  }

  update(id: number, updateProductv2Dto: UpdateProductv2Dto) {
    return `This action updates a #${id} productv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} productv2`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    );
  }
}
