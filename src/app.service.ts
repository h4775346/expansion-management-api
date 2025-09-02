import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './clients/entities/client.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDoc, ResearchDocDocument } from './research/schemas/research-doc.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectModel(ResearchDoc.name)
    private researchDocModel: Model<ResearchDocDocument>,
  ) {}

  getHello(): string {
    return 'Welcome to the Expansion Management API!';
  }

  getHealth(): any {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'expansion-management-api',
    };
  }
}