export * from './auth.service';
import { AuthService } from './auth.service';
export * from './channel.service';
import { ChannelService } from './channel.service';
export * from './follow.service';
import { FollowService } from './follow.service';
export * from './match.service';
import { MatchService } from './match.service';
export * from './pm.service';
import { PmService } from './pm.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AuthService, ChannelService, FollowService, MatchService, PmService, UserService];
