import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
  constructor(
    @InjectModel(ResearchDoc.name)
    private researchDocModel: Model<ResearchDocDocument>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createResearchDocDto: CreateResearchDocDto): Promise<ResearchDoc> {
    const createdResearchDoc = await this.researchDocModel.create(createResearchDocDto);
    return createdResearchDoc;
  }

  async search(user: any, searchDto: SearchResearchDocDto): Promise<ResearchDoc[]> {
    const query: any = {};
    
    // For non-admin users, filter by their projects
    if (user.role !== 'admin') {
      const userProjects = await this.projectsRepository.find({
        where: { client_id: user.id },
        select: ['id'],
      });
      
      const projectIds = userProjects.map(project => project.id.toString());
      
      // If user has no projects, return empty array
      if (projectIds.length === 0) {
        return [];
      }
      
      query.projectId = { $in: projectIds };
    }
    
    if (searchDto.projectId) {
      query.projectId = searchDto.projectId;
    }
    
    if (searchDto.tag) {
      query.tags = searchDto.tag;
    }
    
    let mongoQuery = this.researchDocModel.find(query);
    
    if (searchDto.text) {
      mongoQuery = mongoQuery.find({
        $text: { $search: searchDto.text }
      });
    }
    
    return mongoQuery.exec();
  }

  async findAll(user: any, query: PaginateQuery): Promise<Paginated<ResearchDoc>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Build the MongoDB query
    const mongoQuery: any = {};
    
    // For non-admin users, filter by their projects
    if (user.role !== 'admin') {
      const userProjects = await this.projectsRepository.find({
        where: { client_id: user.id },
        select: ['id'],
      });
      
      const projectIds = userProjects.map(project => project.id.toString());
      
      // If user has no projects, return empty result
      if (projectIds.length === 0) {
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
    }

    let mongoFindQuery = this.researchDocModel.find(mongoQuery);
    
    // Apply search if provided
    if (query.search) {
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
      mongoFindQuery = mongoFindQuery.sort(sort);
    } else {
      // Default sorting
      mongoFindQuery = mongoFindQuery.sort({ createdAt: -1 });
    }

    // Execute query with pagination
    const data = await mongoFindQuery.skip(skip).limit(limit).exec();
    
    // For counting, we need to use the base filter without skip/limit
    const total = await this.researchDocModel.countDocuments(mongoQuery);

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

    return {
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
  }

  async findOne(user: any, id: string): Promise<ResearchDoc> {
    const researchDoc = await this.researchDocModel.findById(id).exec();
    if (!researchDoc) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
    
    // For non-admin users, check if the document belongs to their project
    if (user.role !== 'admin') {
      const userProject = await this.projectsRepository.findOne({
        where: { 
          id: parseInt(researchDoc.projectId), 
          client_id: user.id 
        }
      });
      
      if (!userProject) {
        throw new ForbiddenException('You do not have permission to access this research document');
      }
    }
    
    return researchDoc;
  }

  async update(user: any, id: string, updateResearchDocDto: CreateResearchDocDto): Promise<ResearchDoc> {
    // For non-admin users, check if the document belongs to their project
    if (user.role !== 'admin') {
      const researchDoc = await this.researchDocModel.findById(id).exec();
      if (!researchDoc) {
        throw new NotFoundException(`Research document with ID ${id} not found`);
      }
      
      const userProject = await this.projectsRepository.findOne({
        where: { 
          id: parseInt(researchDoc.projectId), 
          client_id: user.id 
        }
      });
      
      if (!userProject) {
        throw new ForbiddenException('You do not have permission to update this research document');
      }
    }
    
    const updatedResearchDoc = await this.researchDocModel.findByIdAndUpdate(
      id, 
      updateResearchDocDto, 
      { new: true }
    ).exec();
    
    if (!updatedResearchDoc) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
    
    return updatedResearchDoc;
  }

  async remove(user: any, id: string): Promise<ResearchDoc> {
    // For non-admin users, check if the document belongs to their project
    if (user.role !== 'admin') {
      const researchDoc = await this.researchDocModel.findById(id).exec();
      if (!researchDoc) {
        throw new NotFoundException(`Research document with ID ${id} not found`);
      }
      
      const userProject = await this.projectsRepository.findOne({
        where: { 
          id: parseInt(researchDoc.projectId), 
          client_id: user.id 
        }
      });
      
      if (!userProject) {
        throw new ForbiddenException('You do not have permission to delete this research document');
      }
    }
    
    const deletedResearchDoc = await this.researchDocModel.findByIdAndDelete(id).exec();
    
    if (!deletedResearchDoc) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
    
    return deletedResearchDoc;
  }
}