import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDoc, ResearchDocDocument } from './schemas/research-doc.schema';
import { CreateResearchDocDto } from './dto/create-research-doc.dto';
import { SearchResearchDocDto } from './dto/search-research-doc.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { Paginated } from 'nestjs-paginate/lib/paginate';

@Injectable()
export class ResearchService {
  constructor(
    @InjectModel(ResearchDoc.name)
    private researchDocModel: Model<ResearchDocDocument>,
  ) {}

  async create(createResearchDocDto: CreateResearchDocDto): Promise<ResearchDoc> {
    const createdResearchDoc = await this.researchDocModel.create(createResearchDocDto);
    return createdResearchDoc;
  }

  async search(searchDto: SearchResearchDocDto): Promise<ResearchDoc[]> {
    const query: any = {};
    
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

  async findAll(query: PaginateQuery): Promise<Paginated<ResearchDoc>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Build the MongoDB query
    let mongoQuery = this.researchDocModel.find();
    
    // Apply search if provided
    if (query.search) {
      mongoQuery = mongoQuery.find({
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
      mongoQuery = mongoQuery.sort(sort);
    } else {
      // Default sorting
      mongoQuery = mongoQuery.sort({ createdAt: -1 });
    }

    // Execute query with pagination
    const data = await mongoQuery.skip(skip).limit(limit).exec();
    const total = await this.researchDocModel.countDocuments(mongoQuery.getFilter()).exec();

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

  async findOne(id: string): Promise<ResearchDoc> {
    const researchDoc = await this.researchDocModel.findById(id).exec();
    if (!researchDoc) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
    return researchDoc;
  }

  async update(id: string, updateResearchDocDto: CreateResearchDocDto): Promise<ResearchDoc> {
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

  async remove(id: string): Promise<ResearchDoc> {
    const deletedResearchDoc = await this.researchDocModel.findByIdAndDelete(id).exec();
    
    if (!deletedResearchDoc) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
    
    return deletedResearchDoc;
  }
}