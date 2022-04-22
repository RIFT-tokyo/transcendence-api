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
      logging: 'all',
      entities: ['dist/**/*.entity{.js,.ts}'],
    }),
    UsersModule,
    AuthModule,
    MatchesModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, AppGateway],
})
export class AppModule {}
