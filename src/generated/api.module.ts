import { DynamicModule, HttpService, HttpModule, Module, Global } from '@nestjs/common';
import { Configuration } from './configuration';

import { AuthService } from './api/auth.service';
import { ChannelService } from './api/channel.service';
import { FollowService } from './api/follow.service';
import { MatchService } from './api/match.service';
import { UserService } from './api/user.service';

@Global()
@Module({
  imports:      [ HttpModule ],
  exports:      [
    AuthService,
    ChannelService,
    FollowService,
    MatchService,
    UserService
  ],
  providers: [
    AuthService,
    ChannelService,
    FollowService,
    MatchService,
    UserService
  ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): DynamicModule {
        return {
            module: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( httpService: HttpService) { }
}
