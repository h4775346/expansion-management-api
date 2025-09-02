import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorService } from '../vendors/entities/vendor-service.entity';
import { VendorCountry } from '../vendors/entities/vendor-country.entity';
import { ProjectService } from '../projects/entities/project-service.entity';
import { Service } from '../common/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      VendorService,
      VendorCountry,
      ProjectService,
      Service,
    ]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}