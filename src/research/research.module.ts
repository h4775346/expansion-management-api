import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { ResearchDoc, ResearchDocSchema } from './schemas/research-doc.schema';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResearchDoc.name, schema: ResearchDocSchema }]),
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService, MongooseModule],
})
export class ResearchModule {}