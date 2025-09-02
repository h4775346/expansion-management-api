import { Controller, Post, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('matching')
@Controller('projects')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(':id/matches/rebuild')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rebuild matches for a project' })
  @ApiResponse({ status: 200, description: 'Matches rebuilt successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async rebuildMatches(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.matchingService.rebuildMatches(id, req.user.id, req.user.role);
  }
}