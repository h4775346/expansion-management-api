import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    // Check if client already exists
    const existingClient = await this.clientsRepository.findOne({
      where: { email: registerDto.email },
    });
    
    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Create client
    const client = this.clientsRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: 'client', // Default role for new registrations
    });
    
    const savedClient = await this.clientsRepository.save(client);
    
    // Generate JWT token
    const payload = { email: savedClient.email, sub: savedClient.id, role: savedClient.role };
    return {
      access_token: this.jwtService.sign(payload),
      client: {
        id: savedClient.id,
        name: savedClient.name,
        email: savedClient.email,
        role: savedClient.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const client = await this.validateClient(loginDto.email, loginDto.password);
    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: client.email, sub: client.id, role: client.role };
    return {
      access_token: this.jwtService.sign(payload),
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: client.role,
      },
    };
  }

  async validateClient(email: string, password: string): Promise<Client | null> {
    const client = await this.clientsRepository.findOne({ where: { email } });
    if (client && await bcrypt.compare(password, client.password)) {
      return client;
    }
    return null;
  }
}