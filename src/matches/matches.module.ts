import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
// Removed MatchingController import
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorService } from '../vendors/entities/vendor-service.entity';
import { VendorCountry } from '../vendors/entities/vendor-country.entity';
import { ProjectService } from '../projects/entities/project-service.entity';
import { Service } from '../common/entities/service.entity';
import { Client } from '../clients/entities/client.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([
      Match, 
      Project, 
      Vendor, 
      VendorService,
      VendorCountry,
      ProjectService,
      Service,
      Client
    ])
  ],
  controllers: [], // Removed MatchingController
  providers: [MatchesService],
  exports: [MatchesService, TypeOrmModule],
})
export class MatchesModule {}