import { forwardRef, Module } from '@nestjs/common';
import { PmsService } from './pms.service';
import { PmsGateway } from './pms.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { PrivateMessageUser } from 'src/entities/private-message-user.entity';
import { PrivateMessage } from 'src/entities/private-message.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Message, PrivateMessage, PrivateMessageUser]),
  ],
  exports: [TypeOrmModule, PmsService],
  providers: [PmsService, PmsGateway],
})
export class PmsModule {}
