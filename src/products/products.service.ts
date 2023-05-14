import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSourse: DataSource,
  ) {}

  @Auth(ValidRoles.owner)
  async create(createProductDto: CreateProductDto, user: User) {
    const { priceToBuy, priceToSell } = createProductDto;

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        user,
      });

      product.profit = priceToSell - priceToBuy;
      await this.productRepository.save(product);

      return {
        product,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  @Auth(ValidRoles.owner)
  async findAllProducts(user: User | Employee) {
    try {
      const products = await this.productRepository.find();
      const productsToShow = products.filter(
        (product) => product.user.id == user.id,
      );
      return productsToShow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  @Auth(ValidRoles.owner)
  async findOne(body: { id: string }, user: User) {
    try {
      const products = await this.productRepository.find();
      console.log(body.id);

      console.log(products);

      const productToShow = products.find((prod) => prod.id == body.id);

      console.log(productToShow);

      return productToShow === undefined ? { notFound: true } : productToShow;
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return {
      id: body.id,
    };
  }

  @Auth(ValidRoles.owner)
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  @Auth(ValidRoles.owner)
  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    );
  }
}
