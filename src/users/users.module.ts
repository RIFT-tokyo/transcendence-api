import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MeController } from './me.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from '../common/interceptor/current-user.interceptor';
import { UsersGateway } from './users.gateway';
import { ChannelsModule } from '../channels/channels.module';
import { PmsModule } from '../pms/pms.module';
import { Achievement } from '../entities/achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement]),
    forwardRef(() => ChannelsModule),
    forwardRef(() => PmsModule),
  ],
  exports: [TypeOrmModule, UsersService],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    UsersGateway,
  ],
  controllers: [UsersController, MeController],
})
export class UsersModule {}
