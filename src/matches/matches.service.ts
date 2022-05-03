import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Match } from '../entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async findAll(limit?: number, offset?: number) {
    return await this.matchRepository.find({
      where: {
        end_at: Not(IsNull()),
      },
      order: { end_at: 'DESC' },
      relations: ['host_player', 'guest_player'],
      skip: offset,
      take: limit,
    });
  }
}
