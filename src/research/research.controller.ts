import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { CreateResearchDocDto } from './dto/create-research-doc.dto';
import { SearchResearchDocDto } from './dto/search-research-doc.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a research document' })
  @ApiResponse({ status: 201, description: 'Research document successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createResearchDocDto: CreateResearchDocDto) {
    return this.researchService.create(createResearchDocDto);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search research documents' })
  @ApiResponse({ status: 200, description: 'Research documents retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  search(@Query() searchDto: SearchResearchDocDto) {
    return this.researchService.search(searchDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all research documents' })
  @ApiResponse({ status: 200, description: 'Research documents retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by column and direction (e.g., name:ASC)', example: 'createdAt:DESC' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', example: 'document' })
  @ApiQuery({ name: 'searchBy', required: false, description: 'Columns to search in (comma-separated)', example: 'title,content' })
  @ApiQuery({ name: 'select', required: false, description: 'Columns to select (comma-separated)', example: 'title,content,createdAt' })
  findAll(@Paginate() query: PaginateQuery) {
    return this.researchService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a research document by ID' })
  @ApiResponse({ status: 200, description: 'Research document retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Research document not found.' })
  findOne(@Param('id') id: string) {
    return this.researchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a research document' })
  @ApiResponse({ status: 200, description: 'Research document updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Research document not found.' })
  update(@Param('id') id: string, @Body() updateResearchDocDto: CreateResearchDocDto) {
    return this.researchService.update(id, updateResearchDocDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a research document' })
  @ApiResponse({ status: 200, description: 'Research document deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Research document not found.' })
  remove(@Param('id') id: string) {
    return this.researchService.remove(id);
  }
}