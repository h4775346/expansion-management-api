import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto = {
        name: 'Test Client',
        email: 'test@example.com',
        password: 'password123',
      };

      const client = {
        id: 1,
        ...createClientDto,
        created_at: new Date(),
      };

      mockRepository.create.mockReturnValue(client);
      mockRepository.save.mockResolvedValue(client);

      const result = await service.create(createClientDto);

      expect(result).toEqual(client);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: createClientDto.name,
        email: createClientDto.email,
      }));
      expect(mockRepository.save).toHaveBeenCalledWith(client);
    });
  });
});