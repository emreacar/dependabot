import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /**
   * Sperate Client and Backend
   */
  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  /** Swagger Documentation */
  const config = new DocumentBuilder()
    .setTitle('DependencyBot')
    .setDescription('API Descriptions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apiDoc', app, document);

  /** client-side config */
  app.useStaticAssets(join(__dirname, '..', 'client/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'client/views'));
  app.setViewEngine('hbs');
  /** client-side config */

  await app.listen(process.env.APP_PORT);
}

bootstrap();
