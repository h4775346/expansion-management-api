import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../matches/entities/match.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorCountry } from '../vendors/entities/vendor-country.entity';
import { Project } from '../projects/entities/project.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDoc, ResearchDocDocument } from '../research/schemas/research-doc.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectModel(ResearchDoc.name)
    private researchDocModel: Model<ResearchDocDocument>,
  ) {}

  async getTopVendors(sinceDays: number = 30): Promise<any[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - sinceDays);
    
    // Get top 3 vendors per country by average score
    const topVendorsQuery = this.matchesRepository
      .createQueryBuilder('match')
      .select('vendorCountry.country', 'country')
      .addSelect('vendor.id', 'vendor_id')
      .addSelect('vendor.name', 'vendor_name')
      .addSelect('AVG(match.score)', 'avg_score')
      .addSelect('COUNT(match.id)', 'match_count')
      .innerJoin(Vendor, 'vendor', 'vendor.id = match.vendor_id')
      .innerJoin(VendorCountry, 'vendorCountry', 'vendorCountry.vendor_id = vendor.id')
      .where('match.created_at >= :sinceDate', { sinceDate })
      .groupBy('vendorCountry.country')
      .addGroupBy('vendor.id')
      .addGroupBy('vendor.name')
      .addGroupBy('vendorCountry.country')
      .orderBy('vendorCountry.country', 'ASC')
      .addOrderBy('avg_score', 'DESC');
    
    const results = await topVendorsQuery.getRawMany();
    
    // Group by country and take top 3 per country
    const groupedByCountry: { [key: string]: any[] } = {};
    
    results.forEach(result => {
      const country = result.country;
      if (!groupedByCountry[country]) {
        groupedByCountry[country] = [];
      }
      
      if (groupedByCountry[country].length < 3) {
        groupedByCountry[country].push({
          vendor_id: result.vendor_id,
          vendor_name: result.vendor_name,
          avg_score: parseFloat(result.avg_score),
          match_count: parseInt(result.match_count),
        });
      }
    });
    
    // Add research_docs count for each vendor
    const finalResults = [];
    
    for (const country in groupedByCountry) {
      const vendors = groupedByCountry[country];
      
      for (const vendor of vendors) {
        // Get research docs count for projects in this country
        const researchDocsCount = await this.getResearchDocsCountForCountry(country);
        
        finalResults.push({
          country,
          vendor: {
            id: vendor.vendor_id,
            name: vendor.vendor_name,
            avg_score: vendor.avg_score,
            match_count: vendor.match_count,
          },
          research_docs_count: researchDocsCount,
        });
      }
    }
    
    return finalResults;
  }
  
  private async getResearchDocsCountForCountry(country: string): Promise<number> {
    // Find projects in the specified country
    const projects = await this.projectsRepository.find({
      where: { country: country },
    });
    
    if (projects.length === 0) {
      return 0;
    }
    
    // Get the project IDs
    const projectIds = projects.map(project => project.id.toString());
    
    // Count research docs with those project IDs
    const count = await this.researchDocModel.countDocuments({
      projectId: { $in: projectIds },
    });
    
    return count;
  }
}