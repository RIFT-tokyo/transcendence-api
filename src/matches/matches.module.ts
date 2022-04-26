import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  exports: [TypeOrmModule, MatchesService],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
