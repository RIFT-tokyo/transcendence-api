import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelUserPermissionsService } from './channel-user-permissions.service';
import { ChannelUserPermission } from '../entities/channel-user-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelUserPermission])],
  exports: [TypeOrmModule, ChannelsService, ChannelUserPermissionsService],
  providers: [ChannelsService, ChannelUserPermissionsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
