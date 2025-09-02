import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailerSendService } from './mailersend.service';

@Module({
  providers: [NotificationsService, MailerSendService],
  exports: [NotificationsService],
})
export class NotificationsModule {}