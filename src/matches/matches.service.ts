import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorCountry } from '../vendors/entities/vendor-country.entity';
import { VendorService } from '../vendors/entities/vendor-service.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private notificationsService: NotificationsService,
  ) {}

  async findAllByProject(projectId: number): Promise<Match[]> {
    return this.matchesRepository.find({ where: { project_id: projectId } });
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async rebuildMatches(projectId: number): Promise<Match[]> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['projectServices', 'projectServices.service', 'client'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    
    // Get all vendors that match the project's country
    const vendorsInCountry = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .innerJoin(VendorCountry, 'vendorCountry', 'vendorCountry.vendor_id = vendor.id')
      .where('vendorCountry.country = :country', { country: project.country })
      .getMany();
    
    if (vendorsInCountry.length === 0) {
      return [];
    }
    
    // Get project service IDs
    const projectServiceIds = project.projectServices.map(ps => ps.service_id);
    
    if (projectServiceIds.length === 0) {
      return [];
    }
    
    // Calculate matches
    const matches: Match[] = [];
    
    for (const vendor of vendorsInCountry) {
      // Get vendor services
      const vendorWithServices = await this.vendorsRepository
        .createQueryBuilder('vendor')
        .innerJoinAndSelect('vendor.vendorServices', 'vendorService')
        .where('vendor.id = :vendorId', { vendorId: vendor.id })
        .getOne();
      
      // Fix: Check if vendorWithServices exists and has vendorServices before accessing
      const vendorServiceIds = vendorWithServices && vendorWithServices.vendorServices ? 
        vendorWithServices.vendorServices.map(vs => vs.service_id) : [];
      
      // Calculate overlap
      const overlapCount = vendorServiceIds.filter(id => projectServiceIds.includes(id)).length;
      
      if (overlapCount > 0) {
        // Calculate score: (overlapCount * 2) + vendor.rating + SLA_weight
        const slaWeight = vendor.response_sla_hours ? 
          Math.max(0, 10 - vendor.response_sla_hours / 24) : 0;
        
        const score = (overlapCount * 2) + (vendor.rating || 0) + slaWeight;
        
        // Create or update match
        const match = this.matchesRepository.create({
          project_id: projectId,
          vendor_id: vendor.id,
          score,
        });
        
        matches.push(match);
      }
    }
    
    // Save all matches (using upsert to handle duplicates)
    const savedMatches: Match[] = [];
    for (const match of matches) {
      const savedMatch = await this.upsert(match.project_id, match.vendor_id, match.score);
      savedMatches.push(savedMatch);
    }
    
    // Send notifications for high-score matches
    for (const match of savedMatches) {
      // Check if this is a new match by looking for it in the database before we updated
      const existingMatch = await this.matchesRepository.findOne({
        where: { project_id: match.project_id, vendor_id: match.vendor_id }
      });
      
      // Send notification if this is a new match or if the score is now high enough
      if (!existingMatch || match.score >= parseFloat(process.env.MATCH_NOTIFICATION_THRESHOLD || '8.0')) {
        await this.notificationsService.sendHighScoreMatchNotification(
          match,
          project,
          project.client
        );
      }
    }
    
    return savedMatches;
  }

  async upsert(projectId: number, vendorId: number, score: number): Promise<Match> {
    // Try to find existing match
    let match = await this.matchesRepository.findOne({
      where: { project_id: projectId, vendor_id: vendorId },
    });
    
    const isNewMatch = !match;
    
    if (match) {
      // Update existing match
      match.score = score;
      match = await this.matchesRepository.save(match);
    } else {
      // Create new match
      match = this.matchesRepository.create({
        project_id: projectId,
        vendor_id: vendorId,
        score,
      });
      match = await this.matchesRepository.save(match);
    }
    
    // Send notification for high-score matches
    if (isNewMatch || match.score >= parseFloat(process.env.MATCH_NOTIFICATION_THRESHOLD || '8.0')) {
      const project = await this.projectsRepository.findOne({
        where: { id: projectId },
        relations: ['client'],
      });
      
      if (project) {
        await this.notificationsService.sendHighScoreMatchNotification(
          match,
          project,
          project.client
        );
      }
    }
    
    return match;
  }
}