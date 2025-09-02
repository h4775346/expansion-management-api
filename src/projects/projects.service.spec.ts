import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectService } from './entities/project-service.entity';
import { Service } from '../common/entities/service.entity';

const mockProjectsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  findOneBy: jest.fn(),
};

const mockProjectServicesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
};

const mockServicesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
        {
          provide: getRepositoryToken(ProjectService),
          useValue: mockProjectServicesRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServicesRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const clientId = 1;
      const createProjectDto = {
        country: 'USA',
        budget: 10000,
        status: 'active',
        services_needed: ['Web Development', 'UI/UX Design'],
      };

      const project = {
        id: 1,
        client_id: clientId,
        ...createProjectDto,
        created_at: new Date(),
        projectServices: [],
      };

      mockProjectsRepository.create.mockReturnValue(project);
      mockProjectsRepository.save.mockResolvedValue(project);
      mockServicesRepository.find.mockResolvedValue([]);
      mockServicesRepository.save.mockResolvedValue([]);
      mockProjectsRepository.findOne.mockResolvedValue(project);

      const result = await service.create(clientId, createProjectDto);

      expect(result).toEqual(project);
      expect(mockProjectsRepository.create).toHaveBeenCalledWith({
        ...createProjectDto,
        client_id: clientId,
        status: 'active',
      });
      expect(mockProjectsRepository.save).toHaveBeenCalledWith(project);
    });
  });
});