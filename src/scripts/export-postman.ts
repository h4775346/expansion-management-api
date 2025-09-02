import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../app.module';
import * as converter from 'openapi-to-postmanv2';
import * as dotenv from 'dotenv';

// Load environment variables before app initialization
dotenv.config();

async function exportPostman() {
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
  
  // Convert to Postman collection
  converter.convert({ type: 'json', data: JSON.stringify(document) }, {}, (err, result: any) => {
    if (err) {
      console.error('Error converting to Postman collection:', err);
      return;
    }
    
    if (result.result) {
      // Get the Postman collection
      let postmanCollection = result.output[0].data;
      
      // Update the request bodies with examples
      postmanCollection = updateRequestBodyExamples(postmanCollection);
      
      writeFileSync('./docs/postman_collection.json', JSON.stringify(postmanCollection, null, 2));
      console.log('Postman collection exported to docs/postman_collection.json');
    } else {
      console.error('Error converting to Postman collection:', result.message || 'Unknown error');
    }
  });
  
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

function updateRequestBodyExamples(postmanCollection: any) {
  // Helper function to format JSON examples
  const formatExample = (example: any): string => {
    return JSON.stringify(example, null, 2);
  };
  
  // Define examples for each endpoint
  const examples: Record<string, string> = {
    // Auth endpoints
    'Register a new client': formatExample({
      email: 'englishh7366@gmail.com',
      name: 'Protik Service',
      password: 'password123'
    }),
    'Login a client': formatExample({
      email: 'englishh7366@gmail.com',
      password: 'password123'
    }),
    
    // Project endpoints
    'Create a new project': formatExample({
      country: 'USA',
      budget: 50000,
      status: 'active',
      services_needed: ['Web Development', 'UI/UX Design']
    }),
    
    // Vendor endpoints
    'Create a new vendor': formatExample({
      name: 'Tech Solutions Inc.',
      rating: 4.8,
      response_sla_hours: 24,
      services: ['Web Development', 'Mobile App Development', 'UI/UX Design'],
      countries: ['USA', 'Canada']
    }),
    
    // Research endpoints
    'Create a research document': formatExample({
      projectId: '1',
      title: 'Market Analysis for USA Expansion',
      content: 'Comprehensive market analysis for expanding web development services in the USA market.',
      tags: ['market-analysis', 'USA', 'web-development']
    }),
    
    // Client endpoints
    'Create a new client': formatExample({
      email: 'newclient@example.com',
      name: 'New Client',
      password: 'securepassword123',
      role: 'client'
    }),
    'Create a new client (admin only)': formatExample({
      email: 'newclient@example.com',
      name: 'New Client',
      password: 'securepassword123',
      role: 'client'
    })
  };
  
  // Recursively search for items in the collection and update request bodies
  function updateItems(items: any[]) {
    for (const item of items) {
      if (item.item) {
        // This is a folder, recursively update its items
        updateItems(item.item);
      } else if (item.request) {
        // This is a request, check if we have an example for it
        const itemName = item.name;
        
        // Look for exact match first
        if (examples[itemName]) {
          // Update the request body with the example
          item.request.body = {
            mode: 'raw',
            raw: examples[itemName],
            options: {
              raw: {
                language: 'json'
              }
            }
          };
        } else {
          // Try partial matching for more flexible matching
          for (const [key, example] of Object.entries(examples)) {
            if (itemName.includes(key) || key.includes(itemName)) {
              item.request.body = {
                mode: 'raw',
                raw: example,
                options: {
                  raw: {
                    language: 'json'
                  }
                }
              };
              break;
            }
          }
        }
      }
    }
  }
  
  // Update the items in the collection
  if (postmanCollection.item) {
    updateItems(postmanCollection.item);
  }
  
  return postmanCollection;
}

exportPostman();