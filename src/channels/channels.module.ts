import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMessage } from '../entities/channel-message.entity';
import { Message } from '../entities/message.entity';
import { UsersModule } from '../users/users.module';
import { Channel } from '../entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsGateway } from './channels.gateway';
import { ChannelsService } from './channels.service';
import { ChannelUserPermission } from '../entities/channel-user-permission.entity';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([
      Channel,
      Message,
      ChannelMessage,
      ChannelUserPermission,
    ]),
  ],
  exports: [TypeOrmModule, ChannelsService],
  providers: [ChannelsService, ChannelsGateway],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
