import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Client } from '../clients/entities/client.entity';
import { VendorService } from '../vendors/entities/vendor-service.entity';
import { VendorCountry } from '../vendors/entities/vendor-country.entity';
import { ProjectService } from '../projects/entities/project-service.entity';
import { Service } from '../common/entities/service.entity';
import { NotificationsService } from '../notifications/notifications.service';

const mockMatchesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockProjectsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockVendorsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(null),
  })),
};

const mockClientsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockVendorServiceRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockVendorCountryRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockProjectServiceRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockServiceRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockNotificationsService = {
  sendHighScoreMatchNotification: jest.fn(),
};

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: mockMatchesRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
        {
          provide: getRepositoryToken(Vendor),
          useValue: mockVendorsRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientsRepository,
        },
        {
          provide: getRepositoryToken(VendorService),
          useValue: mockVendorServiceRepository,
        },
        {
          provide: getRepositoryToken(VendorCountry),
          useValue: mockVendorCountryRepository,
        },
        {
          provide: getRepositoryToken(ProjectService),
          useValue: mockProjectServiceRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServiceRepository,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByProject', () => {
    it('should return matches for a project', async () => {
      const projectId = 1;
      const matches = [
        { id: 1, project_id: projectId, vendor_id: 1, score: 8.5, created_at: new Date() },
        { id: 2, project_id: projectId, vendor_id: 2, score: 7.2, created_at: new Date() },
      ];

      mockMatchesRepository.find.mockResolvedValue(matches);

      const result = await service.findAllByProject(projectId);

      expect(result).toEqual(matches);
      expect(mockMatchesRepository.find).toHaveBeenCalledWith({ where: { project_id: projectId } });
    });
  });
});