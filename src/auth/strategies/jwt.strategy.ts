import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(  
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // The role is already in the payload, but we fetch the client to ensure it still exists
    const client = await this.clientsRepository.findOne({
      where: { id: payload.sub },
    });
    
    // If client doesn't exist, return null to deny access
    if (!client) {
      return null;
    }
    
    // Return the user object with id, email, and role from the payload
    // This ensures consistency with the role that was used to generate the token
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role || client.role || 'client' // Use role from payload first, then from DB, then default
    };
  }
}