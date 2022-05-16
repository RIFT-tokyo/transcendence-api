import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { PaginationParams } from '../types/PaginationParams';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseMatchListDTO } from './match.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  private readonly logger = new Logger('MatchesController');
  constructor(private readonly matchesService: MatchesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async matchHistory(
    @Query() { limit = 10, offset }: PaginationParams,
  ): Promise<ResponseMatchListDTO> {
    const entriesList = await this.matchesService.findAll(limit, offset);
    return new ResponseMatchListDTO(entriesList);
  }
}
