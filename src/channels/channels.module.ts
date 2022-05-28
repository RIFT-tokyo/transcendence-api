import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMessage } from 'src/entities/channel-message.entity';
import { Message } from 'src/entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { Channel } from '../entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsGateway } from './channels.gateway';
import { ChannelsService } from './channels.service';
import { ChannelUserPermissionsService } from './channel-user-permissions.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Channel, Message, ChannelMessage]),
  ],
  exports: [TypeOrmModule, ChannelsService],
  providers: [ChannelsService, ChannelUserPermissionsService, ChannelsGateway],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
