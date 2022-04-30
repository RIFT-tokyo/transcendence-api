import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  exports: [TypeOrmModule, ChannelsService],
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
