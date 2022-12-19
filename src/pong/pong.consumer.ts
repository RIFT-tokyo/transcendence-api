import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Match } from '../entities/match.entity';
import { MatchesService } from '../matches/matches.service';
import { UsersService } from '../users/users.service';

@Processor('pong')
export class PongConsumer {
  @Inject()
  private readonly matchesService: MatchesService;
  @Inject()
  private readonly usersService: UsersService;

  private readonly logger = new Logger('processor');

  @Process('addAchievement')
  async addAchievement(job: Job<{ userId: number }>) {
    const matches = await this.matchesService.getAllResult(job.data.userId);
    let winCounts = 0;
    let loseCounts = 0;
    matches.forEach((match: Match) => {
      const winId =
        match.host_player_points > match.guest_player_points
          ? match.host_player.id
          : match.guest_player.id;
      if (winId === job.data.userId) winCounts++;
      else loseCounts++;
    });
    this.usersService.addAchievement(job.data.userId, winCounts, loseCounts);
  }
}
