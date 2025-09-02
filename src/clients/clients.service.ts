import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import * as bcrypt from 'bcrypt';
import { PaginateQuery } from 'nestjs-paginate';
import { paginate, Paginated } from 'nestjs-paginate';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create({
      ...createClientDto,
      password: await bcrypt.hash(createClientDto.password, 10),
    });
    return this.clientsRepository.save(client);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Client>> {
    return paginate(query, this.clientsRepository, {
      sortableColumns: ['id', 'name', 'email', 'created_at'],
      searchableColumns: ['name', 'email'],
      defaultSortBy: [['id', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async findOneByEmail(email: string): Promise<Client> {
    return this.clientsRepository.findOne({ where: { email } });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
  }
}