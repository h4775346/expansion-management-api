import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new client (admin only)' })
  @ApiResponse({ status: 201, description: 'Client successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all clients (admin only)' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by column and direction (e.g., name:ASC)', example: 'id:ASC' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', example: 'john' })
  @ApiQuery({ name: 'searchBy', required: false, description: 'Columns to search in (comma-separated)', example: 'name,email' })
  @ApiQuery({ name: 'select', required: false, description: 'Columns to select (comma-separated)', example: 'id,name,email' })
  findAll(@Paginate() query: PaginateQuery) {
    return this.clientsService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current client profile' })
  @ApiResponse({ status: 200, description: 'Client profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a client by ID (admin can see any, clients can see their own)' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async findOne(@Request() req, @Param('id') id: string) {
    // Admins can see any client, clients can only see their own
    if (req.user.role === 'admin') {
      return this.clientsService.findOne(+id);
    } else {
      if (req.user.id !== +id) {
        throw new ForbiddenException('You can only view your own profile');
      }
      return this.clientsService.findOne(+id);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a client by ID (admin can update any, clients can update their own)' })
  @ApiResponse({ status: 200, description: 'Client updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async update(@Request() req, @Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    // Admins can update any client, clients can only update their own
    if (req.user.role === 'admin') {
      return this.clientsService.update(+id, updateClientDto);
    } else {
      if (req.user.id !== +id) {
        throw new ForbiddenException('You can only update your own profile');
      }
      return this.clientsService.update(+id, updateClientDto);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a client by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}