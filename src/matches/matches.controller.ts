import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { PaginationParams } from 'src/types/paginationParams';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseMatchDTO } from './match.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  private readonly logger = new Logger('MatchesController');
  constructor(private readonly matchesService: MatchesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async matchHistory(
    @Query() { offset, limit }: PaginationParams,
  ): Promise<ResponseMatchDTO[]> {
    const matches = await this.matchesService.findAll(offset, limit);
    return matches.map((match) => new ResponseMatchDTO(match));
  }
}
