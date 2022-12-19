import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntriesList } from '../types/EntriesList';
import { IsNull, Not, Repository } from 'typeorm';
import { Match, Result } from '../entities/match.entity';
import { CreateMatchDTO } from './match.dto';
import { UsersService } from '../users/users.service';

const GOAL_POINT = 7;

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly usersService: UsersService,
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
    const hostUser = await this.usersService.findUserById(match.host_player_id);
    const result = await this.matchRepository.save({
      host_player: hostUser,
    });
    return result;
  }

  async joinUser(matchId: number, userId: number): Promise<Match> {
    const joinUser = await this.usersService.findUserById(userId);
    await this.matchRepository.save({
      id: matchId,
      guest_player: joinUser,
    });
    const match = await this.findOne(matchId);
    if (!match) {
      throw new NotFoundException();
    }
    return match;
  }

  async gainPoint(id: number, isHost: boolean): Promise<Match> {
    // TODO: transactionを貼りたい
    const match = await this.findOne(id);
    if (!match) {
      throw new NotFoundException();
    }
    if (isHost) {
      match.host_player_points++;
    } else {
      match.guest_player_points++;
    }
    if (
      match.host_player_points >= GOAL_POINT ||
      match.guest_player_points >= GOAL_POINT
    ) {
      match.end_at = new Date();
    }
    return await this.matchRepository.save(match);
  }

  async startGame(id: number): Promise<Match> {
    const match = await this.findOne(id);
    if (!match) {
      throw new NotFoundException();
    }
    match.start_at = new Date();
    return await this.matchRepository.save(match);
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

  async getAllResult(userId: number): Promise<Match[]> {
    return await this.matchRepository.find({
      relations: ['host_player', 'guest_player'],
      where: [
        {
          host_player: { id: userId },
          guest_player: Not(IsNull()),
          start_at: Not(IsNull()),
          end_at: Not(IsNull()),
        },
        {
          guest_player: { id: userId },
          host_player: Not(IsNull()),
          start_at: Not(IsNull()),
          end_at: Not(IsNull()),
        },
      ],
    });
  }
}
