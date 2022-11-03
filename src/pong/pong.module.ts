import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PongGateway } from './pong.gateway';
import { Match } from '../entities/match.entity';
import { MatchesService } from '../matches/matches.service';
import { MatchesModule } from 'src/matches/matches.module';
@Module({
  imports: [TypeOrmModule.forFeature([Match]), forwardRef(() => MatchesModule)],
  exports: [TypeOrmModule],
  providers: [PongGateway, MatchesService],
})
export class PongModule {}
