import { forwardRef, Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), forwardRef(() => UsersModule)],
  exports: [TypeOrmModule, MatchesService, UsersService],
  controllers: [MatchesController],
  providers: [MatchesService, UsersService],
})
export class MatchesModule {}
