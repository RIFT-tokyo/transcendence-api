import { DynamicModule, HttpService, HttpModule, Module, Global } from '@nestjs/common';
import { Configuration } from './configuration';

import { AuthService } from './api/auth.service';
import { BlockService } from './api/block.service';
import { ChannelService } from './api/channel.service';
import { FollowService } from './api/follow.service';
import { MatchService } from './api/match.service';
import { PmService } from './api/pm.service';
import { UserService } from './api/user.service';

@Global()
@Module({
  imports:      [ HttpModule ],
  exports:      [
    AuthService,
    BlockService,
    ChannelService,
    FollowService,
    MatchService,
    PmService,
    UserService
  ],
  providers: [
    AuthService,
    BlockService,
    ChannelService,
    FollowService,
    MatchService,
    PmService,
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
