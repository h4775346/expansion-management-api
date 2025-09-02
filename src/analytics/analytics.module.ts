import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Match } from '../matches/entities/match.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project } from '../projects/entities/project.entity';
import { ResearchModule } from '../research/research.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Vendor, Project]),
    ResearchModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}