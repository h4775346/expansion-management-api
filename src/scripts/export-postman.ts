import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../app.module';
import * as converter from 'openapi-to-postmanv2';

async function exportPostman() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Expansion Management API')
    .setDescription('API for managing client projects, vendor matching, and analytics')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Convert to Postman collection
  converter.convert({ type: 'json', data: JSON.stringify(document) }, {}, (err, result: any) => {
    if (err) {
      console.error('Error converting to Postman collection:', err);
      return;
    }
    
    if (result.result) {
      writeFileSync('./docs/postman_collection.json', JSON.stringify(result.output[0].data, null, 2));
      console.log('Postman collection exported to docs/postman_collection.json');
    } else {
      console.error('Error converting to Postman collection:', result.message || 'Unknown error');
    }
  });
  
  await app.close();
}

exportPostman();