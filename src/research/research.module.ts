import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services and Controllers
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';

// Schemas and Entities
import { ResearchDoc, ResearchDocSchema } from './schemas/research-doc.schema';
import { Project } from '../projects/entities/project.entity';

/**
 * Research Module
 * 
 * This module handles all operations related to research documents stored in MongoDB.
 * It provides CRUD operations with role-based access control, ensuring that clients
 * can only access documents related to their own projects, while admins can access all.
 * 
 * Dependencies:
 * - MongooseModule: For MongoDB operations
 * - TypeOrmModule: For MySQL project lookups (to verify ownership)
 */
@Module({
  imports: [
    // Import Mongoose feature module for ResearchDoc schema
    MongooseModule.forFeature([{ name: ResearchDoc.name, schema: ResearchDocSchema }]),
    
    // Import TypeORM feature module for Project entity
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [
    // REST API controller for research documents
    ResearchController
  ],
  providers: [
    // Business logic service for research documents
    ResearchService
  ],
  exports: [
    // Export service for use in other modules
    ResearchService,
    
    // Export Mongoose module for schema access
    MongooseModule
  ]
})
export class ResearchModule {}