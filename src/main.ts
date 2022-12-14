import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //!Configuaracion de documentacion de api
  const config = new DocumentBuilder()
    .setTitle('Harve App')
    .setDescription('Endpoints para la aplicacion de administracion de stock y ventas.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //!-----------------------------------------
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`App corriendo en el puerto: ${PORT}.`);

}
bootstrap();
