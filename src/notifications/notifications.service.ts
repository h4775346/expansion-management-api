import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Match } from '../matches/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Client } from '../clients/entities/client.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorService } from '../vendors/entities/vendor-service.entity';
import { VendorCountry } from '../vendors/entities/vendor-country.entity';
import { ProjectService } from '../projects/entities/project-service.entity';
import { Service } from '../common/entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(VendorService)
    private vendorServiceRepository: Repository<VendorService>,
    @InjectRepository(VendorCountry)
    private vendorCountryRepository: Repository<VendorCountry>,
    @InjectRepository(ProjectService)
    private projectServiceRepository: Repository<ProjectService>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '587'),
      secure: (process.env.MAIL_ENCRYPTION || '').toLowerCase() === 'ssl' || 
              parseInt(process.env.MAIL_PORT || '0') === 465, // true for 465 (SSL), false for other ports
      auth: {
        user: process.env.MAIL_USERNAME || process.env.SMTP_USER || 'your-smtp-user',
        pass: process.env.MAIL_PASSWORD || process.env.SMTP_PASS || 'your-smtp-password',
      },
    });
  }

  async sendHighScoreMatchNotification(match: Match, project: Project, client: Client) {
    // Only send notification for matches with score above threshold
    const threshold = parseFloat(process.env.MATCH_NOTIFICATION_THRESHOLD || '8.0');
    
    if (match.score < threshold) {
      return; // Don't send notification for low scores
    }

    // Fetch detailed vendor information
    const vendor = await this.vendorRepository.findOne({
      where: { id: match.vendor_id },
    });

    // Fetch vendor services
    const vendorServices = await this.vendorServiceRepository
      .createQueryBuilder('vendorService')
      .innerJoinAndSelect('vendorService.service', 'service')
      .where('vendorService.vendor_id = :vendorId', { vendorId: match.vendor_id })
      .getMany();

    // Fetch vendor countries
    const vendorCountries = await this.vendorCountryRepository.find({
      where: { vendor_id: match.vendor_id },
    });

    // Fetch project services
    const projectServices = await this.projectServiceRepository
      .createQueryBuilder('projectService')
      .innerJoinAndSelect('projectService.service', 'service')
      .where('projectService.project_id = :projectId', { projectId: match.project_id })
      .getMany();

    const vendorServiceNames = vendorServices.map(vs => vs.service.name);
    const projectServiceNames = projectServices.map(ps => ps.service.name);
    const commonServices = vendorServiceNames.filter(service => 
      projectServiceNames.includes(service)
    );

    // Load and compile the email template
    const templatePath = path.join(__dirname, 'templates', 'high-score-match.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    // Prepare template data
    const templateData = {
      clientName: client.name,
      matchScore: match.score.toFixed(2),
      commonServicesCount: commonServices.length,
      vendorRating: vendor?.rating ? vendor.rating.toFixed(1) : 'N/A',
      vendorSLA: vendor?.response_sla_hours || 'N/A',
      projectCountry: project.country,
      projectBudget: project.budget ? project.budget.toLocaleString() : 'Not specified',
      projectStatus: project.status,
      projectServices: projectServiceNames,
      vendorName: vendor?.name || 'Unknown Vendor',
      vendorServices: vendorServiceNames,
      vendorCountries: vendorCountries.map(vc => vc.country),
      commonServices: commonServices,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    };

    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS || process.env.SMTP_FROM || '"Expansion Management" <no-reply@example.com>',
      to: client.email,
      subject: `🌟 New High-Score Vendor Match for Your Project in ${project.country}`,
      text: `Hello ${client.name},

🎉 Great News! We've found a high-scoring vendor match for your project.

📊 Match Details:
- Match Score: ${match.score.toFixed(2)}/10
- Project Country: ${project.country}
- Project Budget: $${project.budget ? project.budget.toLocaleString() : 'Not specified'}

🏢 Vendor Profile:
- Name: ${vendor?.name || 'Unknown Vendor'}
- Rating: ${vendor?.rating ? vendor.rating.toFixed(1) : 'N/A'} ⭐
- Response SLA: ${vendor?.response_sla_hours ? vendor.response_sla_hours + ' hours' : 'Not specified'}

📋 Service Match:
- Required Services: ${projectServiceNames.join(', ')}
- Vendor Services: ${vendorServiceNames.join(', ')}
- Common Services: ${commonServices.join(', ')}

🌍 Vendor Coverage:
- Countries: ${vendorCountries.map(vc => vc.country).join(', ')}

Please log in to the system to review this match and take action.

Best regards,
Expansion Management Team`,
      html: template(templateData),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Notification email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending notification email:', error);
    }
  }
}