import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDoc, ResearchDocDocument } from './schemas/research-doc.schema';
import { CreateResearchDocDto } from './dto/create-research-doc.dto';
import { SearchResearchDocDto } from './dto/search-research-doc.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { Paginated } from 'nestjs-paginate/lib/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(
    @InjectModel(ResearchDoc.name)
    private researchDocModel: Model<ResearchDocDocument>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  /**
   * Create a new research document
   * @param createResearchDocDto - The data to create the research document
   * @returns The created research document
   */
  async create(createResearchDocDto: CreateResearchDocDto): Promise<ResearchDoc> {
    try {
      this.logger.log(`Creating research document for project ${createResearchDocDto.projectId}`);
      const createdResearchDoc = await this.researchDocModel.create(createResearchDocDto);
      this.logger.log(`Successfully created research document with ID ${createdResearchDoc._id}`);
      return createdResearchDoc;
    } catch (error) {
      this.logger.error(`Failed to create research document: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Search research documents with optional filtering
   * @param user - The authenticated user
   * @param searchDto - Search parameters
   * @returns Array of matching research documents
   */
  async search(user: any, searchDto: SearchResearchDocDto): Promise<ResearchDoc[]> {
    try {
      this.logger.log(`Searching research documents for user ${user.id} with role ${user.role}`);
      
      const query: any = {};
      
      // For non-admin users, filter by their projects
      if (user.role !== 'admin') {
        this.logger.log(`Non-admin user, filtering by client_id: ${user.id}`);
        
        const userProjects = await this.projectsRepository.find({
          where: { client_id: user.id },
          select: ['id'],
        });
        
        this.logger.log(`Found ${userProjects.length} projects for user ${user.id}`);
        
        const projectIds = userProjects.map(project => project.id.toString());
        
        // If user has no projects, return empty array
        if (projectIds.length === 0) {
          this.logger.log(`User ${user.id} has no projects, returning empty array`);
          return [];
        }
        
        query.projectId = { $in: projectIds };
        this.logger.log(`Filtering by project IDs: ${JSON.stringify(projectIds)}`);
      }
      
      if (searchDto.projectId) {
        query.projectId = searchDto.projectId;
        this.logger.log(`Filtering by specific project ID: ${searchDto.projectId}`);
      }
      
      if (searchDto.tag) {
        query.tags = searchDto.tag;
        this.logger.log(`Filtering by tag: ${searchDto.tag}`);
      }
      
      let mongoQuery = this.researchDocModel.find(query);
      
      if (searchDto.text) {
        this.logger.log(`Performing text search: ${searchDto.text}`);
        mongoQuery = mongoQuery.find({
          $text: { $search: searchDto.text }
        });
      }
      
      const results = await mongoQuery.exec();
      this.logger.log(`Search returned ${results.length} documents`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to search research documents: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all research documents with pagination
   * @param user - The authenticated user
   * @param query - Pagination and filtering parameters
   * @returns Paginated list of research documents
   */
  async findAll(user: any, query: PaginateQuery): Promise<Paginated<ResearchDoc>> {
    try {
      this.logger.log(`Finding all research documents for user ${user.id} with role ${user.role}`);
      
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build the MongoDB query
      const mongoQuery: any = {};
      
      // For non-admin users, filter by their projects
      if (user.role !== 'admin') {
        this.logger.log(`Non-admin user, filtering by client_id: ${user.id}`);
        
        const userProjects = await this.projectsRepository.find({
          where: { client_id: user.id },
          select: ['id'],
        });
        
        this.logger.log(`Found ${userProjects.length} projects for user ${user.id}`);
        
        const projectIds = userProjects.map(project => project.id.toString());
        
        // If user has no projects, return empty result
        if (projectIds.length === 0) {
          this.logger.log(`User ${user.id} has no projects, returning empty result`);
          return {
            data: [],
            meta: {
              itemsPerPage: limit,
              totalItems: 0,
              currentPage: page,
              totalPages: 0,
              sortBy: query.sortBy || [],
              searchBy: query.searchBy || [],
              search: query.search || '',
              select: query.select || [],
            },
            links: {
              first: '',
              previous: '',
              current: '',
              next: '',
              last: '',
            },
          } as Paginated<ResearchDoc>;
        }
        
        mongoQuery.projectId = { $in: projectIds };
        this.logger.log(`Filtering by project IDs: ${JSON.stringify(projectIds)}`);
      }

      let mongoFindQuery = this.researchDocModel.find(mongoQuery);
      
      // Apply search if provided
      if (query.search) {
        this.logger.log(`Applying search filter: ${query.search}`);
        mongoFindQuery = mongoFindQuery.find({
          $or: [
            { title: { $regex: query.search, $options: 'i' } },
            { content: { $regex: query.search, $options: 'i' } }
          ]
        });
      }
      
      // Apply sorting if provided
      if (query.sortBy && query.sortBy.length > 0) {
        const sort: any = {};
        query.sortBy.forEach(([field, direction]) => {
          sort[field] = direction.toLowerCase() === 'desc' ? -1 : 1;
        });
        this.logger.log(`Applying sort: ${JSON.stringify(sort)}`);
        mongoFindQuery = mongoFindQuery.sort(sort);
      } else {
        // Default sorting
        this.logger.log('Applying default sort by createdAt descending');
        mongoFindQuery = mongoFindQuery.sort({ createdAt: -1 });
      }

      // Execute query with pagination
      const data = await mongoFindQuery.skip(skip).limit(limit).exec();
      this.logger.log(`Query returned ${data.length} documents`);
      
      // For counting, we need to use the base filter without skip/limit
      const total = await this.researchDocModel.countDocuments(mongoQuery);
      this.logger.log(`Total documents matching filter: ${total}`);

      // Build links
      const path = query.path || '';
      const buildLink = (pageNum: number) => {
        const params = new URLSearchParams();
        if (limit !== 10) params.set('limit', limit.toString());
        if (pageNum !== 1) params.set('page', pageNum.toString());
        if (query.sortBy && query.sortBy.length > 0) {
          params.set('sortBy', query.sortBy.map(([field, direction]) => `${field}:${direction}`).join(','));
        }
        if (query.search) params.set('search', query.search);
        if (query.searchBy && query.searchBy.length > 0) params.set('searchBy', query.searchBy.join(','));
        if (query.select && query.select.length > 0) params.set('select', query.select.join(','));
        
        return params.toString() ? `${path}?${params.toString()}` : path;
      };

      const result = {
        data,
        meta: {
          itemsPerPage: limit,
          totalItems: total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          sortBy: query.sortBy || [],
          searchBy: query.searchBy || [],
          search: query.search || '',
          select: query.select || [],
        },
        links: {
          first: buildLink(1),
          previous: page > 1 ? buildLink(page - 1) : '',
          current: buildLink(page),
          next: page < Math.ceil(total / limit) ? buildLink(page + 1) : '',
          last: buildLink(Math.ceil(total / limit)),
        },
      } as Paginated<ResearchDoc>;

      this.logger.log(`Returning paginated result: ${result.data.length} items, page ${result.meta.currentPage} of ${result.meta.totalPages}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to find research documents: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a specific research document by ID
   * @param user - The authenticated user
   * @param id - The ID of the research document
   * @returns The research document
   */
  async findOne(user: any, id: string): Promise<ResearchDoc> {
    try {
      this.logger.log(`Finding research document ${id} for user ${user.id} with role ${user.role}`);
      
      const researchDoc = await this.researchDocModel.findById(id).exec();
      if (!researchDoc) {
        this.logger.warn(`Research document with ID ${id} not found`);
        throw new NotFoundException(`Research document with ID ${id} not found`);
      }
      
      // For non-admin users, check if the document belongs to their project
      if (user.role !== 'admin') {
        this.logger.log(`Verifying ownership for non-admin user ${user.id}`);
        
        const userProject = await this.projectsRepository.findOne({
          where: { 
            id: parseInt(researchDoc.projectId), 
            client_id: user.id 
          }
        });
        
        if (!userProject) {
          this.logger.warn(`User ${user.id} does not have permission to access research document ${id}`);
          throw new ForbiddenException('You do not have permission to access this research document');
        }
        
        this.logger.log(`User ${user.id} has permission to access research document ${id}`);
      }
      
      this.logger.log(`Successfully found research document ${id}`);
      return researchDoc;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Failed to find research document ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update a research document
   * @param user - The authenticated user
   * @param id - The ID of the research document
   * @param updateResearchDocDto - The update data
   * @returns The updated research document
   */
  async update(user: any, id: string, updateResearchDocDto: CreateResearchDocDto): Promise<ResearchDoc> {
    try {
      this.logger.log(`Updating research document ${id} for user ${user.id} with role ${user.role}`);
      
      // For non-admin users, check if the document belongs to their project
      if (user.role !== 'admin') {
        this.logger.log(`Verifying ownership for non-admin user ${user.id}`);
        
        const researchDoc = await this.researchDocModel.findById(id).exec();
        if (!researchDoc) {
          this.logger.warn(`Research document with ID ${id} not found`);
          throw new NotFoundException(`Research document with ID ${id} not found`);
        }
        
        const userProject = await this.projectsRepository.findOne({
          where: { 
            id: parseInt(researchDoc.projectId), 
            client_id: user.id 
          }
        });
        
        if (!userProject) {
          this.logger.warn(`User ${user.id} does not have permission to update research document ${id}`);
          throw new ForbiddenException('You do not have permission to update this research document');
        }
        
        this.logger.log(`User ${user.id} has permission to update research document ${id}`);
      }
      
      const updatedResearchDoc = await this.researchDocModel.findByIdAndUpdate(
        id, 
        updateResearchDocDto, 
        { new: true }
      ).exec();
      
      if (!updatedResearchDoc) {
        this.logger.warn(`Research document with ID ${id} not found after update attempt`);
        throw new NotFoundException(`Research document with ID ${id} not found`);
      }
      
      this.logger.log(`Successfully updated research document ${id}`);
      return updatedResearchDoc;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Failed to update research document ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a research document
   * @param user - The authenticated user
   * @param id - The ID of the research document
   * @returns The deleted research document
   */
  async remove(user: any, id: string): Promise<ResearchDoc> {
    try {
      this.logger.log(`Deleting research document ${id} for user ${user.id} with role ${user.role}`);
      
      // For non-admin users, check if the document belongs to their project
      if (user.role !== 'admin') {
        this.logger.log(`Verifying ownership for non-admin user ${user.id}`);
        
        const researchDoc = await this.researchDocModel.findById(id).exec();
        if (!researchDoc) {
          this.logger.warn(`Research document with ID ${id} not found`);
          throw new NotFoundException(`Research document with ID ${id} not found`);
        }
        
        const userProject = await this.projectsRepository.findOne({
          where: { 
            id: parseInt(researchDoc.projectId), 
            client_id: user.id 
          }
        });
        
        if (!userProject) {
          this.logger.warn(`User ${user.id} does not have permission to delete research document ${id}`);
          throw new ForbiddenException('You do not have permission to delete this research document');
        }
        
        this.logger.log(`User ${user.id} has permission to delete research document ${id}`);
      }
      
      const deletedResearchDoc = await this.researchDocModel.findByIdAndDelete(id).exec();
      
      if (!deletedResearchDoc) {
        this.logger.warn(`Research document with ID ${id} not found after delete attempt`);
        throw new NotFoundException(`Research document with ID ${id} not found`);
      }
      
      this.logger.log(`Successfully deleted research document ${id}`);
      return deletedResearchDoc;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Failed to delete research document ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}