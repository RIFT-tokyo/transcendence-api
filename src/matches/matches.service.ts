import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntriesList } from 'src/types/EntriesList';
import { IsNull, Not, Repository } from 'typeorm';
import { Match } from '../entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<EntriesList<Match>> {
    const [matches, count] = await this.matchRepository.findAndCount({
      where: {
        end_at: Not(IsNull()),
      },
      order: { end_at: 'DESC' },
      relations: ['host_player', 'guest_player'],
      skip: offset,
      take: limit,
    });
    const has_next = count > (offset ?? 0) + limit;
    return { matches, has_next };
  }
}
