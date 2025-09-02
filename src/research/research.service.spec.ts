import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ResearchService } from './research.service';
import { ResearchDoc } from './schemas/research-doc.schema';

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
});