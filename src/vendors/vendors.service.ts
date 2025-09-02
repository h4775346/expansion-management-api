import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorService } from './entities/vendor-service.entity';
import { VendorCountry } from './entities/vendor-country.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Service } from '../common/entities/service.entity';
import { PaginateQuery } from 'nestjs-paginate';
import { paginate, Paginated } from 'nestjs-paginate';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(VendorService)
    private vendorServicesRepository: Repository<VendorService>,
    @InjectRepository(VendorCountry)
    private vendorCountriesRepository: Repository<VendorCountry>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Create the vendor
    const vendor = this.vendorsRepository.create({
      name: createVendorDto.name,
      rating: createVendorDto.rating,
      response_sla_hours: createVendorDto.response_sla_hours,
    });
    const savedVendor = await this.vendorsRepository.save(vendor);

    // Handle services
    if (createVendorDto.services && createVendorDto.services.length > 0) {
      const services = await this.findOrCreateServices(createVendorDto.services);
      const vendorServices = services.map(service => 
        this.vendorServicesRepository.create({
          vendor_id: savedVendor.id,
          service_id: service.id,
        })
      );
      await this.vendorServicesRepository.save(vendorServices);
    }

    // Handle countries
    if (createVendorDto.countries && createVendorDto.countries.length > 0) {
      const vendorCountries = createVendorDto.countries.map(country => 
        this.vendorCountriesRepository.create({
          vendor_id: savedVendor.id,
          country,
        })
      );
      await this.vendorCountriesRepository.save(vendorCountries);
    }

    return this.findOne(savedVendor.id);
  }

  async findAll(country: string | undefined, service: string | undefined, query: PaginateQuery): Promise<Paginated<Vendor>> {
    const qb = this.vendorsRepository.createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.vendorServices', 'vendorService')
      .leftJoinAndSelect('vendor.vendorCountries', 'vendorCountry')
      .leftJoinAndSelect('vendorService.service', 'service');
    
    if (country) {
      qb.andWhere('vendorCountry.country = :country', { country });
    }
    
    if (service) {
      qb.andWhere('service.name = :service', { service });
    }
    
    return paginate(query, qb, {
      sortableColumns: ['id', 'name', 'rating', 'response_sla_hours', 'created_at'],
      searchableColumns: ['name'],
      filterableColumns: {
        'rating': true,
      },
      defaultSortBy: [['id', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['vendorServices', 'vendorCountries', 'vendorServices.service'],
    });
    
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    
    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    
    // Update vendor fields
    Object.assign(vendor, updateVendorDto);
    await this.vendorsRepository.save(vendor);
    
    // Handle services if provided
    if (updateVendorDto.services) {
      // Remove existing vendor-service relationships
      await this.vendorServicesRepository.delete({ vendor_id: id });
      
      // Add new vendor-service relationships
      if (updateVendorDto.services.length > 0) {
        const services = await this.findOrCreateServices(updateVendorDto.services);
        const vendorServices = services.map(service => 
          this.vendorServicesRepository.create({
            vendor_id: id,
            service_id: service.id,
          })
        );
        await this.vendorServicesRepository.save(vendorServices);
      }
    }
    
    // Handle countries if provided
    if (updateVendorDto.countries) {
      // Remove existing vendor-country relationships
      await this.vendorCountriesRepository.delete({ vendor_id: id });
      
      // Add new vendor-country relationships
      if (updateVendorDto.countries.length > 0) {
        const vendorCountries = updateVendorDto.countries.map(country => 
          this.vendorCountriesRepository.create({
            vendor_id: id,
            country,
          })
        );
        await this.vendorCountriesRepository.save(vendorCountries);
      }
    }
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorsRepository.remove(vendor);
  }

  private async findOrCreateServices(serviceNames: string[]): Promise<Service[]> {
    // Handle empty service names array
    if (!serviceNames || serviceNames.length === 0) {
      return [];
    }
    
    // Find existing services
    const existingServices = await this.servicesRepository.find({
      where: {
        name: In(serviceNames),
      },
    }) || [];
    
    const existingServiceNames = existingServices.map(service => service.name);
    const newServiceNames = serviceNames.filter(name => !existingServiceNames.includes(name));
    
    // Create new services
    let savedNewServices: Service[] = [];
    if (newServiceNames.length > 0) {
      const newServices = newServiceNames.map(name => 
        this.servicesRepository.create({ name })
      );
      savedNewServices = await this.servicesRepository.save(newServices);
    }
    
    return [...existingServices, ...savedNewServices];
  }
}