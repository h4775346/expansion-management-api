import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../app.module';
import * as dotenv from 'dotenv';

// Load environment variables before app initialization
dotenv.config();

async function exportOpenAPI() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Expansion Management API')
    .setDescription('API for managing client projects, vendor matching, and analytics')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Add example request bodies from seed data
  addExampleBodies(document);
  
  // Write to docs directory
  writeFileSync('./docs/openapi.json', JSON.stringify(document, null, 2));
  
  console.log('OpenAPI specification exported to docs/openapi.json');
  
  await app.close();
}

function addExampleBodies(document: any) {
  // Add example for auth registration
  if (document.paths['/auth/register']?.post) {
    document.paths['/auth/register'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/RegisterDto'
          },
          example: {
            email: 'englishh7366@gmail.com',
            name: 'Protik Service',
            password: 'password123'
          }
        }
      }
    };
  }
  
  // Add example for project creation
  if (document.paths['/projects']?.post) {
    document.paths['/projects'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateProjectDto'
          },
          example: {
            country: 'USA',
            budget: 50000,
            status: 'active',
            services_needed: ['Web Development', 'UI/UX Design']
          }
        }
      }
    };
  }
  
  // Add example for vendor creation
  if (document.paths['/vendors']?.post) {
    document.paths['/vendors'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateVendorDto'
          },
          example: {
            name: 'Tech Solutions Inc.',
            rating: 4.8,
            response_sla_hours: 24,
            services: ['Web Development', 'Mobile App Development', 'UI/UX Design'],
            countries: ['USA', 'Canada']
          }
        }
      }
    };
  }
  
  // Add example for research document creation
  if (document.paths['/research']?.post) {
    document.paths['/research'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateResearchDocDto'
          },
          example: {
            projectId: '1',
            title: 'Market Analysis for USA Expansion',
            content: 'Comprehensive market analysis for expanding web development services in the USA market.',
            tags: ['market-analysis', 'USA', 'web-development']
          }
        }
      }
    };
  }
  
  // Add example for client creation (admin only)
  if (document.paths['/clients']?.post) {
    document.paths['/clients'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateClientDto'
          },
          example: {
            email: 'newclient@example.com',
            name: 'New Client',
            password: 'securepassword123',
            role: 'client'
          }
        }
      }
    };
  }
  
  // Add example for login
  if (document.paths['/auth/login']?.post) {
    document.paths['/auth/login'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginDto'
          },
          example: {
            email: 'englishh7366@gmail.com',
            password: 'password123'
          }
        }
      }
    };
  }
}

exportOpenAPI();