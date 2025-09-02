import { Injectable, ForbiddenException } from '@nestjs/common';
import { MatchesService } from '../matches/matches.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class MatchingService {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly projectsService: ProjectsService
  ) {}

  async rebuildMatches(projectId: number, clientId: number, role: string) {
    // Check if the project belongs to the client (unless user is admin)
    if (role !== 'admin') {
      try {
        await this.projectsService.findOneForClient(projectId, clientId);
      } catch (error) {
        throw new ForbiddenException('You do not have permission to rebuild matches for this project');
      }
    }
    
    return this.matchesService.rebuildMatches(projectId);
  }
}