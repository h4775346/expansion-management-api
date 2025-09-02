import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private matchesService: MatchesService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMatchesRebuild() {
    this.logger.log('Starting daily matches rebuild job');
    
    try {
      // Get all active projects
      const activeProjects = await this.projectsRepository.find({
        where: { status: 'active' },
      });
      
      this.logger.log(`Found ${activeProjects.length} active projects`);
      
      // Rebuild matches for each active project
      for (const project of activeProjects) {
        try {
          await this.matchesService.rebuildMatches(project.id);
          this.logger.log(`Rebuilt matches for project ${project.id}`);
        } catch (error) {
          this.logger.error(`Failed to rebuild matches for project ${project.id}: ${error.message}`);
        }
      }
      
      this.logger.log('Daily matches rebuild job completed');
    } catch (error) {
      this.logger.error(`Daily matches rebuild job failed: ${error.message}`);
    }
  }

  // Additional job to flag SLA violations (if needed)
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlySLACheck() {
    this.logger.log('Starting hourly SLA check job');
    
    // Implementation for SLA violation checking would go here
    // This could involve checking vendor response times and sending alerts
    
    this.logger.log('Hourly SLA check job completed');
  }
}