import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResearchService } from './research.service';
import { ResearchDoc } from './schemas/research-doc.schema';
import { Project } from '../projects/entities/project.entity';

const mockResearchDocModel = {
  new: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({
      _id: '1',
      projectId: '1',
      title: 'Test Document',
      content: 'Test content',
      tags: ['test', 'document'],
      createdAt: new Date(),
    }),
  })),
  constructor: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  exec: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
};

const mockProjectsRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('ResearchService', () => {
  let service: ResearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchService,
        {
          provide: getModelToken(ResearchDoc.name),
          useValue: mockResearchDocModel,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<ResearchService>(ResearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a research document', async () => {
      const createResearchDocDto = {
        projectId: '1',
        title: 'Test Document',
        content: 'Test content',
        tags: ['test', 'document'],
      };

      const researchDoc = {
        _id: '1',
        ...createResearchDocDto,
        createdAt: new Date(),
      };

      mockResearchDocModel.create.mockResolvedValue(researchDoc);

      const result = await service.create(createResearchDocDto);

      expect(result).toEqual(researchDoc);
      expect(mockResearchDocModel.create).toHaveBeenCalledWith(createResearchDocDto);
    });
  });

  describe('findAll', () => {
    it('should return all research documents for admin user', async () => {
      const adminUser = { id: 1, role: 'admin' };
      const query = { page: 1, limit: 10 };
      
      const researchDocs = [{
        _id: '1',
        projectId: '1',
        title: 'Test Document',
        content: 'Test content',
        tags: ['test'],
        createdAt: new Date(),
      }];
      
      const paginatedResult = {
        data: researchDocs,
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
          sortBy: [],
          searchBy: [],
          search: '',
          select: [],
        },
        links: {
          first: '',
          previous: '',
          current: '',
          next: '',
          last: '',
        },
      };
      
      mockResearchDocModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(researchDocs),
      });
      
      mockResearchDocModel.countDocuments.mockResolvedValue(1);
      
      const result = await service.findAll(adminUser, query as any);
      
      expect(result).toEqual(paginatedResult);
    });

    it('should return only user\'s research documents for client user', async () => {
      const clientUser = { id: 2, role: 'client' };
      const query = { page: 1, limit: 10 };
      
      const userProjects = [{ id: 1 }, { id: 2 }];
      
      const researchDocs = [{
        _id: '1',
        projectId: '1',
        title: 'Test Document',
        content: 'Test content',
        tags: ['test'],
        createdAt: new Date(),
      }];
      
      const paginatedResult = {
        data: researchDocs,
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
          sortBy: [],
          searchBy: [],
          search: '',
          select: [],
        },
        links: {
          first: '',
          previous: '',
          current: '',
          next: '',
          last: '',
        },
      };
      
      mockProjectsRepository.find.mockResolvedValue(userProjects);
      
      mockResearchDocModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(researchDocs),
      });
      
      mockResearchDocModel.countDocuments.mockResolvedValue(1);
      
      const result = await service.findAll(clientUser, query as any);
      
      expect(result).toEqual(paginatedResult);
      expect(mockProjectsRepository.find).toHaveBeenCalledWith({
        where: { client_id: clientUser.id },
        select: ['id'],
      });
    });
  });
});