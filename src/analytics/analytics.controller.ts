import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TopVendorsQueryDto } from './dto/top-vendors-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top vendors by country' })
  @ApiResponse({ status: 200, description: 'Top vendors retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getTopVendors(@Query() query: TopVendorsQueryDto) {
    return this.analyticsService.getTopVendors(query.sinceDays);
  }
}