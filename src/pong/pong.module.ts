import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PongGateway } from './pong.gateway';
import { Match } from '../entities/match.entity';
import { MatchesService } from '../matches/matches.service';
@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  exports: [TypeOrmModule, MatchesService],
  providers: [PongGateway, MatchesService],
})
export class PongModule {}
