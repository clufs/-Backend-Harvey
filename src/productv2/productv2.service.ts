import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';

import { Size, Color, PriceTier, Productv2, Desing } from './entities';
import { User } from 'src/auth/entities/user.entity';

import {
  CreateProductv2Dto,
  CreateColorDto,
  CreateDesingDto,
  CreatePriceTierDto,
  CreateSizesDto,
  UpdateSizeStockDto,
} from './dto';
import { UpdateProductv2Dto } from './dto/update-productv2.dto';

@Injectable()
export class Productv2Service {
  constructor(
    @InjectRepository(Productv2)
    private readonly productRepository: Repository<Productv2>,

    @InjectRepository(PriceTier)
    private readonly priceTierRepository: Repository<PriceTier>,

    @InjectRepository(Desing)
    private readonly desingRepository: Repository<Desing>,

    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,

    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
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

      await this.productRepository.save(product);

      return {
        product,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  @Auth(ValidRoles.owner)
  async update(id: string, updateProductDto: UpdateProductv2Dto, user: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['priceTiers'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.title = updateProductDto.title ?? product.title;
    product.category = updateProductDto.category ?? product.category;
    product.subCategory = updateProductDto.subCategory ?? product.subCategory;
    product.provider = updateProductDto.provider ?? product.provider;
    product.priceToBuy = updateProductDto.priceToBuy ?? product.priceToBuy;

    // Manejar los niveles de precios (PriceTiers)
    const existingPriceTiers = product.priceTiers;

    // Eliminar niveles de precios que no estén en la actualización
    const updatedPriceTiersIds = updateProductDto.priceTiers
      .map((pt) => pt.id)
      .filter((id) => id);
    const priceTiersToRemove = existingPriceTiers.filter(
      (pt) => !updatedPriceTiersIds.includes(pt.id),
    );
    await this.priceTierRepository.remove(priceTiersToRemove);

    // Actualizar o crear nuevos niveles de precios
    const updatedPriceTiers = updateProductDto.priceTiers.map(
      (priceTierDto) => {
        const existingPriceTier = existingPriceTiers.find(
          (pt) => pt.id === priceTierDto.id,
        );

        if (existingPriceTier) {
          // Actualizar el nivel de precio existente
          existingPriceTier.minQuantity = priceTierDto.minQuantity;
          existingPriceTier.price = priceTierDto.price;
          return existingPriceTier;
        } else {
          // Crear un nuevo nivel de precio
          const newPriceTier = new PriceTier();
          newPriceTier.minQuantity = priceTierDto.minQuantity;
          newPriceTier.price = priceTierDto.price;
          newPriceTier.product = product; // Asignar la relación con el producto
          return newPriceTier;
        }
      },
    );

    // Guardar el producto y los PriceTiers actualizados
    product.priceTiers = updatedPriceTiers;
    await this.productRepository.save(product);

    return product;
  }

  @Auth(ValidRoles.owner)
  async addDesing(
    productId: string,
    createDesingDto: CreateDesingDto,
    owner: User,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['desing'],
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado...');
    }

    const newDesing = this.desingRepository.create({
      ...createDesingDto,
      product,
    });

    try {
      product.desing.push(newDesing);

      await this.desingRepository.save(newDesing);

      await this.productRepository.save(product);
      const updatedDesigns = await this.desingRepository.find({
        where: { product: { id: productId } },
      });

      return updatedDesigns;
    } catch (error) {
      if (error.code === '23505') {
        // Código de error para violación de restricción única en PostgreSQL
        throw new ConflictException(
          'Ese nombre ya esta ocupado. Porfavor elija otro!',
        );
      }
      throw error;
    }
  }

  @Auth(ValidRoles.owner)
  async addColorToDesing(
    desingId: string,
    createColorDto: CreateColorDto,
    user: User,
  ) {
    const desing = await this.desingRepository.findOne({
      where: { id: desingId },
      relations: ['color'],
    });

    if (!desing) {
      throw new NotFoundException('diseño no encontrado...');
    }

    const newColor = this.colorRepository.create({
      ...createColorDto,
      desing,
    });

    try {
      desing.color.push(newColor);

      await this.colorRepository.save(newColor);

      await this.desingRepository.save(desing);

      const updateColors = await this.colorRepository.find({
        where: { desing: { id: desingId } },
      });

      return updateColors;
    } catch (error) {
      if (error.code === '23505') {
        // Código de error para violación de restricción única en PostgreSQL
        throw new ConflictException(
          'Ese nombre ya esta ocupado. Porfavor elija otro!',
        );
      }
      throw error;
    }
  }

  @Auth(ValidRoles.owner)
  async addSizes(id: string, createSizeDto: CreateSizesDto, user: User) {
    const color = await this.colorRepository.findOne({
      where: { id },
      relations: ['size'],
    });

    if (!color) {
      throw new NotFoundException('Color no encontrado');
    }

    const sizes = createSizeDto.sizes.map((sizeName) => {
      const size = new Size();
      size.title = sizeName;
      size.color = color; // Asignar el diseño
      return size;
    });

    // Guardar los talles en la base de datos
    await this.sizeRepository.save(sizes);

    return {
      status: 'sucess',
      // prod: color.desing.product,
    };
  }

  @Auth(ValidRoles.owner)
  async updateStock(id: string, updateSizeDto: UpdateSizeStockDto, user: User) {
    const size = await this.sizeRepository.findOne({ where: { id } });

    if (!size) {
      throw new NotFoundException('Talle no encontrado');
    }

    size.stock = updateSizeDto.stock;

    try {
      await this.sizeRepository.save(size);
      return {
        status: 'sucess',
        size,
      };
    } catch (error) {
      console.log(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    );
  }
}
