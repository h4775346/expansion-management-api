import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MatchingModule } from './matching/matching.module'; // Changed from MatchesModule
import { ResearchModule } from './research/research.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ClientsModule,
    ProjectsModule,
    VendorsModule,
    MatchingModule, // Changed from MatchesModule
    ResearchModule,
    AnalyticsModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}