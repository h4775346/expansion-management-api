import { Injectable } from '@nestjs/common';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class MatchingService {
  constructor(private readonly matchesService: MatchesService) {}

  async rebuildMatches(projectId: number) {
    return this.matchesService.rebuildMatches(projectId);
  }
}