export * from './auth.service';
import { AuthService } from './auth.service';
export * from './follow.service';
import { FollowService } from './follow.service';
export * from './match.service';
import { MatchService } from './match.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AuthService, FollowService, MatchService, UserService];
