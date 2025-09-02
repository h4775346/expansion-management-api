import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { ResearchDoc, ResearchDocSchema } from './schemas/research-doc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResearchDoc.name, schema: ResearchDocSchema }]),
  ],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService, MongooseModule],
})
export class ResearchModule {}