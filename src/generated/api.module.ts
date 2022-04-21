import { DynamicModule, HttpService, HttpModule, Module, Global } from '@nestjs/common';
import { Configuration } from './configuration';

import { AuthService } from './api/auth.service';
import { DefaultService } from './api/default.service';
import { FollowService } from './api/follow.service';
import { UserService } from './api/user.service';

@Global()
@Module({
  imports:      [ HttpModule ],
  exports:      [
    AuthService,
    DefaultService,
    FollowService,
    UserService
  ],
  providers: [
    AuthService,
    DefaultService,
    FollowService,
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
