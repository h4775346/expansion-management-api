import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectService } from './entities/project-service.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Service } from '../common/entities/service.entity';
import { PaginateQuery } from 'nestjs-paginate';
import { paginate, Paginated } from 'nestjs-paginate';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectService)
    private projectServicesRepository: Repository<ProjectService>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(clientId: number, createProjectDto: CreateProjectDto): Promise<Project> {
    // Create the project
    const project = this.projectsRepository.create({
      ...createProjectDto,
      client_id: clientId,
      status: createProjectDto.status || 'active',
    });
    const savedProject = await this.projectsRepository.save(project);

    // Handle services
    if (createProjectDto.services_needed && createProjectDto.services_needed.length > 0) {
      // Find or create services
      const services = await this.findOrCreateServices(createProjectDto.services_needed);
      
      // Create project-service relationships
      const projectServices = services.map(service => 
        this.projectServicesRepository.create({
          project_id: savedProject.id,
          service_id: service.id,
        })
      );
      await this.projectServicesRepository.save(projectServices);
    }

    return this.findOne(savedProject.id);
  }

  async findAll(clientId: number | undefined, query: PaginateQuery): Promise<Paginated<Project>> {
    const qb = this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.projectServices', 'projectService')
      .leftJoinAndSelect('projectService.service', 'service');
    
    if (clientId) {
      qb.where('project.client_id = :clientId', { clientId });
    }
    
    return paginate(query, qb, {
      sortableColumns: ['id', 'country', 'budget', 'status', 'created_at'],
      searchableColumns: ['country', 'status'],
      defaultSortBy: [['id', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['projectServices', 'projectServices.service'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async findOneForClient(id: number, clientId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, client_id: clientId },
      relations: ['projectServices', 'projectServices.service'],
    });
    
    if (!project) {
      // Check if project exists at all to provide appropriate error
      const exists = await this.projectsRepository.findOne({ where: { id } });
      if (exists) {
        throw new ForbiddenException('You do not have permission to access this project');
      }
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    
    // Update project fields
    Object.assign(project, updateProjectDto);
    await this.projectsRepository.save(project);
    
    // Handle services if provided
    if (updateProjectDto.services_needed) {
      // Remove existing project-service relationships
      await this.projectServicesRepository.delete({ project_id: id });
      
      // Add new project-service relationships
      if (updateProjectDto.services_needed.length > 0) {
        const services = await this.findOrCreateServices(updateProjectDto.services_needed);
        const projectServices = services.map(service => 
          this.projectServicesRepository.create({
            project_id: id,
            service_id: service.id,
          })
        );
        await this.projectServicesRepository.save(projectServices);
      }
    }
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
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
    if (newServiceNames.length > 0) {
      const newServices = newServiceNames.map(name => 
        this.servicesRepository.create({ name })
      );
      const savedNewServices = await this.servicesRepository.save(newServices);
      return [...existingServices, ...savedNewServices];
    }
    
    return existingServices;
  }
}