import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Digital Signage API')
    .setDescription('Digital Signage API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT Token',
        in: 'header ',
      },
      'JWT_auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.join(__dirname, './uploads'));

  app.enableCors({
    origin: ['*', 'http://localhost:3000', 'http://localhost:5173', "https://digital-signature-kappa.vercel.app"],
  });
  await app.listen(8080);
}
bootstrap();
