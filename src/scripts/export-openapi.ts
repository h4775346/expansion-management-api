import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../app.module';

async function exportOpenAPI() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Expansion Management API')
    .setDescription('API for managing client projects, vendor matching, and analytics')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Write to docs directory
  writeFileSync('./docs/openapi.json', JSON.stringify(document, null, 2));
  
  console.log('OpenAPI specification exported to docs/openapi.json');
  
  await app.close();
}

exportOpenAPI();