import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorService } from './entities/vendor-service.entity';
import { VendorCountry } from './entities/vendor-country.entity';
import { Service } from '../common/entities/service.entity';

const mockVendorsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  findOneBy: jest.fn(),
};

const mockVendorServicesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
};

const mockVendorCountriesRepository = {
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

describe('VendorsService', () => {
  let service: VendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorsService,
        {
          provide: getRepositoryToken(Vendor),
          useValue: mockVendorsRepository,
        },
        {
          provide: getRepositoryToken(VendorService),
          useValue: mockVendorServicesRepository,
        },
        {
          provide: getRepositoryToken(VendorCountry),
          useValue: mockVendorCountriesRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServicesRepository,
        },
      ],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vendor', async () => {
      const createVendorDto = {
        name: 'Test Vendor',
        rating: 4.5,
        response_sla_hours: 24,
        services: ['Web Development', 'UI/UX Design'],
        countries: ['USA', 'Canada'],
      };

      const vendor = {
        id: 1,
        ...createVendorDto,
        created_at: new Date(),
        vendorServices: [],
        vendorCountries: [],
      };

      mockVendorsRepository.create.mockReturnValue(vendor);
      mockVendorsRepository.save.mockResolvedValue(vendor);
      mockServicesRepository.find.mockResolvedValue([]);
      mockServicesRepository.save.mockResolvedValue([]);
      mockVendorsRepository.findOne.mockResolvedValue(vendor);

      const result = await service.create(createVendorDto);

      expect(result).toEqual(vendor);
      expect(mockVendorsRepository.create).toHaveBeenCalledWith({
        name: createVendorDto.name,
        rating: createVendorDto.rating,
        response_sla_hours: createVendorDto.response_sla_hours,
      });
      expect(mockVendorsRepository.save).toHaveBeenCalledWith(vendor);
    });
  });
});