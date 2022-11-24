import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PongGateway } from './pong.gateway';
import { Match } from '../entities/match.entity';
import { MatchesService } from '../matches/matches.service';
import { MatchesModule } from 'src/matches/matches.module';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Match]),
    forwardRef(() => MatchesModule),
  ],
  exports: [TypeOrmModule],
  providers: [PongGateway, MatchesService, PongService],
})
export class PongModule {}
