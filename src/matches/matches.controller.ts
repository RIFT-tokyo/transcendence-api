import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseMatchDTO } from './match.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  private readonly logger = new Logger('MatchesController');
  constructor(private readonly matchesService: MatchesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async matchHistory(): Promise<ResponseMatchDTO[]> {
    const matches = await this.matchesService.findAll();
    return matches.map((match) => new ResponseMatchDTO(match));
  }
}
