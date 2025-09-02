import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects (admin) or client\'s projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by column and direction (e.g., name:ASC)', example: 'id:ASC' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', example: 'project' })
  @ApiQuery({ name: 'searchBy', required: false, description: 'Columns to search in (comma-separated)', example: 'name,description' })
  @ApiQuery({ name: 'select', required: false, description: 'Columns to select (comma-separated)', example: 'id,name,description' })
  findAll(@Request() req, @Paginate() query: PaginateQuery) {
    // Admins can see all projects, clients can only see their own
    if (req.user.role === 'admin') {
      return this.projectsService.findAll(undefined, query); // No client ID filter for admins
    } else {
      return this.projectsService.findAll(req.user.id, query); // Filter by client ID for regular users
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    // Admins can see any project, clients can only see their own
    if (req.user.role === 'admin') {
      return this.projectsService.findOne(id);
    } else {
      return this.projectsService.findOneForClient(id, req.user.id);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
    // Admins can update any project, clients can only update their own
    if (req.user.role === 'admin') {
      return this.projectsService.update(id, updateProjectDto);
    } else {
      // Verify the project belongs to the client before updating
      await this.projectsService.findOneForClient(id, req.user.id);
      return this.projectsService.update(id, updateProjectDto);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    // Admins can delete any project, clients can only delete their own
    if (req.user.role === 'admin') {
      return this.projectsService.remove(id);
    } else {
      // Verify the project belongs to the client before deleting
      await this.projectsService.findOneForClient(id, req.user.id);
      return this.projectsService.remove(id);
    }
  }
}