import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntriesList } from '../types/EntriesList';
import { IsNull, Not, Repository } from 'typeorm';
import { Match, Result } from '../entities/match.entity';
import { CreateMatchDTO } from './match.dto';

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
    return { entries: matches, has_next };
  }

  async findOne(id: number): Promise<Match> {
    return this.matchRepository.findOne(id, {
      relations: ['host_player', 'guest_player'],
    });
  }

  async create(match: CreateMatchDTO): Promise<Match> {
    const result = await this.matchRepository.insert(match);
    const id = result.identifiers[0].id;
    return this.matchRepository.findOne(id);
  }

  async finishGame(match: Match): Promise<Match> {
    if (match.host_player_points > match.guest_player_points) {
      match.result = Result.HOST;
    } else if (match.host_player_points < match.guest_player_points) {
      match.result = Result.GUEST;
    } else {
      match.result = Result.DRAW;
    }
    const result = await this.matchRepository.save(match);
    return result;
  }
}
