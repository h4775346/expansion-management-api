import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Match } from '../matches/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Client } from '../clients/entities/client.entity';
import { MailerSendService } from './mailersend.service';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly mailerSendService: MailerSendService) {
    // Only setup SMTP/sendmail if not using MailerSend
    if (process.env.EMAIL_TRANSPORT !== 'mailersend') {
      if (process.env.EMAIL_TRANSPORT === 'sendmail') {
        // Use sendmail transport
        this.transporter = nodemailer.createTransport({
          sendmail: true,
          newline: 'unix',
          path: process.env.SENDMAIL_PATH || '/usr/sbin/sendmail'
        });
      } else {
        // Use SMTP transport (default) with Google SMTP settings
        this.transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.MAIL_PORT || '465'),
          secure: process.env.MAIL_ENCRYPTION === 'ssl', // true for 465, false for other ports
          auth: {
            user: process.env.MAIL_USERNAME || 'your-gmail-username@gmail.com',
            pass: process.env.MAIL_PASSWORD || 'your-gmail-password',
          },
          tls: {
            rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
          }
        });
      }
    }
  }

  async sendHighScoreMatchNotification(match: Match, project: Project, client: Client) {
    // Only send notification for matches with score above threshold
    const threshold = parseFloat(process.env.MATCH_NOTIFICATION_THRESHOLD || '8.0');
    
    if (match.score < threshold) {
      return; // Don't send notification for low scores
    }

    const subject = `New High-Score Match for Project in ${project.country}`;
    const text = `Hello ${client.name},

A new vendor match with a high score (${match.score.toFixed(2)}) has been found for your project in ${project.country}.

Vendor ID: ${match.vendor_id}
Project ID: ${match.project_id}

Please log in to the system to review this match.

Best regards,
Expansion Management Team`;
    
    const html = `<p>Hello ${client.name},</p>
<p>A new vendor match with a high score (<strong>${match.score.toFixed(2)}</strong>) has been found for your project in <strong>${project.country}</strong>.</p>
<p><strong>Vendor ID:</strong> ${match.vendor_id}<br>
<strong>Project ID:</strong> ${match.project_id}</p>
<p>Please <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">log in</a> to the system to review this match.</p>
<p>Best regards,<br>
Expansion Management Team</p>`;

    try {
      if (process.env.EMAIL_TRANSPORT === 'mailersend') {
        // Use MailerSend API
        await this.mailerSendService.sendEmail(
          client.email,
          subject,
          text,
          html
        );
      } else {
        // Use SMTP or sendmail
        const mailOptions = {
          from: process.env.MAIL_FROM_ADDRESS || '"Expansion Management" <no-reply@example.com>',
          to: client.email,
          subject: subject,
          text: text,
          html: html,
        };

        const info = await this.transporter.sendMail(mailOptions);
        console.log('Notification email sent:', info.messageId);
      }
    } catch (error) {
      console.error('Error sending notification email:', error);
    }
  }
}