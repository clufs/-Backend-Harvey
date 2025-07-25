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

import PDFDocument from 'pdfkit';

import bwipjs from 'bwip-js';

import { Response } from 'express';
import { options } from 'pdfkit';

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
  async update(updateProductDto: UpdateProductDto, user: User) {
    try {
      const products = await this.productRepository.find();
      var productToUpdate = products.find(
        (prod) => prod.id == updateProductDto.id,
      );

      if (productToUpdate.user.id == user.id) {
        if (updateProductDto.category) {
          productToUpdate.title = updateProductDto.title;
        }

        if (updateProductDto.priceToBuy)
          productToUpdate.priceToBuy = updateProductDto.priceToBuy;

        if (updateProductDto.priceToSell)
          productToUpdate.priceToSell = updateProductDto.priceToSell;

        if (updateProductDto.stock)
          productToUpdate.stock = updateProductDto.stock;

        productToUpdate.profit =
          productToUpdate.priceToSell - productToUpdate.priceToBuy;
        return this.productRepository.save(productToUpdate);
      } else {
        return {
          msg: 'No tienes permiso para modificar esto.',
        };
      }
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  @Auth(ValidRoles.owner)
  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  // PDF con datos de los productos.
  @Auth(ValidRoles.owner)
  async generatePDF(res: Response, user: User) {
    const products = await this.findAllProducts(user);

    const pdfDoc = new PDFDocument({
      size: 'A4',
      margin: 0,
    });

    pdfDoc.scale(1.0);

    console.log('ola');

    const barcodeWidth = 80; // Ancho del código de barras
    const barcodeHeight = 30; // Alto del código de barras
    const marginX = 30; // Margen horizontal
    const marginY = 30; // Margen vertical

    const gapX = 30; // Espacio horizontal entre códigos de barras
    const gapY = 30; // Espacio vertical entre códigos de barras

    const padding = 15; // Relleno alrededor de la caja de recorte

    const pageWidth =
      pdfDoc.page.width - pdfDoc.page.margins.left - pdfDoc.page.margins.right;
    const pageHeight =
      pdfDoc.page.height - pdfDoc.page.margins.top - pdfDoc.page.margins.bottom;

    const numColumns = Math.floor(pageWidth / (barcodeWidth + gapX));
    const numRows = 12;

    for (const product of products) {
      pdfDoc.addPage();
      const textHeight = pdfDoc.heightOfString(product.title, {
        width: pageWidth,
        align: 'center',
      });

      const contentHeight = numRows * (barcodeHeight + gapY) + textHeight;

      const startPosY = marginY + (pageHeight - contentHeight) / 2;

      const textX = marginX;
      const textY = marginY + 5;

      pdfDoc.fontSize(20).text(product.title, textX, textY, {
        width: pageWidth,
        align: 'center',
        height: textHeight,
        lineGap: 10,
      });

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numColumns; col++) {
          // Genera el código de barras SVG utilizando bwip-js
          const svg = await bwipjs.toBuffer({
            bcid: 'code128',
            width: barcodeWidth,
            scale: 3,
            text: product.id.toString(),
            includetext: false,
          });

          // Calcula la posición del código de barras en la página
          const posX = marginX + col * (barcodeWidth + gapX);
          const posY = startPosY + row * (barcodeHeight + gapY);

          const rectX = posX - padding;
          const rectY = posY - padding;
          const rectWidth = barcodeWidth + 2 * padding;
          const rectHeight = barcodeHeight + 2 * padding;

          // Dibuja el código de barras SVG en el PDF
          pdfDoc.image(svg, posX, posY, {
            width: barcodeWidth,
            height: barcodeHeight,
          });

          pdfDoc.rect(rectX, rectY, rectWidth, rectHeight).stroke();
        }
      }
    }

    // const textHeight = pdfDoc.heightOfString('remera adulto', {
    //   width: pageWidth,
    //   align: 'center',
    // });

    // const contentHeight = numRows * (barcodeHeight + gapY) + textHeight;

    // const startPosY = marginY + (pageHeight - contentHeight) / 2;

    // const textX = marginX;
    // const textY = marginY + 5;

    // pdfDoc.fontSize(20).text('remera adulto modal', textX, textY, {
    //   width: pageWidth,
    //   align: 'center',
    //   height: textHeight,
    //   lineGap: 10,
    // });

    // for (let row = 0; row < numRows; row++) {
    //   for (let col = 0; col < numColumns; col++) {
    //     // Genera el código de barras SVG utilizando bwip-js
    //     const svg = await bwipjs.toBuffer({
    //       bcid: 'code128',
    //       width: barcodeWidth,
    //       scale: 3,
    //       text: '23',
    //       includetext: false,
    //     });

    //     // Calcula la posición del código de barras en la página
    //     const posX = marginX + col * (barcodeWidth + gapX);
    //     const posY = startPosY + row * (barcodeHeight + gapY);

    //     const rectX = posX - padding;
    //     const rectY = posY - padding;
    //     const rectWidth = barcodeWidth + 2 * padding;
    //     const rectHeight = barcodeHeight + 2 * padding;

    //     // Dibuja el código de barras SVG en el PDF
    //     pdfDoc.image(svg, posX, posY, {
    //       width: barcodeWidth,
    //       height: barcodeHeight,
    //     });

    //     pdfDoc.rect(rectX, rectY, rectWidth, rectHeight).stroke();
    //   }
    // }

    // Agrega el texto después de los códigos de barras

    // Establece las cabeceras de respuesta para indicar que es un archivo PDF

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=codigos_de_barras.pdf',
    );

    // Envía el PDF al cliente
    pdfDoc.pipe(res);
    pdfDoc.end();
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, checkear log del servidor',
    );
  }
}
