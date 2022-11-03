import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';
import { MatchesModule } from './matches/matches.module';
import { ChannelsController } from './channels/channels.controller';
import { ChannelsService } from './channels/channels.service';
import { ChannelsModule } from './channels/channels.module';
import { PmsModule } from './pms/pms.module';
import { PongModule } from './pong/pong.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: false,
      logging: true,
      entities: ['dist/**/*.entity{.js,.ts}'],
    }),
    UsersModule,
    AuthModule,
    ChannelsModule,
    MatchesModule,
    PmsModule,
    PongModule,
  ],
  controllers: [AppController, UsersController, ChannelsController],
  providers: [AppService, UsersService, ChannelsService, AppGateway],
})
export class AppModule {}
