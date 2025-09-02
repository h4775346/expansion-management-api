import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class MailerSendService {
  private mailerSend: MailerSend;
  private sender: Sender;

  constructor() {
    this.mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });
    
    this.sender = new Sender(
      process.env.MAIL_FROM_ADDRESS || 'no-reply@example.com',
      process.env.MAIL_FROM_NAME || 'Expansion Management'
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    cc?: string[],
    bcc?: string[]
  ) {
    const recipients = [new Recipient(to)];
    
    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(recipients)
      .setReplyTo(this.sender)
      .setSubject(subject)
      .setText(text)
      .setHtml(html || text);

    if (cc && cc.length > 0) {
      const ccRecipients = cc.map(email => new Recipient(email));
      emailParams.setCc(ccRecipients);
    }

    if (bcc && bcc.length > 0) {
      const bccRecipients = bcc.map(email => new Recipient(email));
      emailParams.setBcc(bccRecipients);
    }

    try {
      const response = await this.mailerSend.email.send(emailParams);
      console.log('Email sent successfully via MailerSend:', response);
      return response;
    } catch (error) {
      console.error('Error sending email via MailerSend:', error);
      throw error;
    }
  }
}