import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Expansion Management API')
    .setDescription('API for managing client projects, vendor matching, and analytics')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Write OpenAPI spec to file
  fs.writeFileSync('./docs/openapi.json', JSON.stringify(document, null, 2));
  
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();