import { Match, MatchList } from '../generated/model/models';
import { Match as MatchEntity, Result } from '../entities/match.entity';
import { ResponseUserDTO } from '../users/users.dto';
import { EntriesList } from '../types/EntriesList';

export class ResponseMatchDTO implements Match {
  id: number;
  host_player: ResponseUserDTO;
  guest_player: ResponseUserDTO;
  host_player_points: number;
  guest_player_points: number;
  result: Match.ResultEnum;
  start_at: string;
  end_at: string;

  constructor(match: MatchEntity) {
    this.id = match.id;
    this.host_player = new ResponseUserDTO(match.host_player);
    this.guest_player = new ResponseUserDTO(match.guest_player);
    this.host_player_points = match.host_player_points;
    this.guest_player_points = match.guest_player_points;
    this.result = match.result;
    this.start_at = match.start_at ? match.start_at.toISOString() : undefined;
    this.end_at = match.end_at ? match.end_at.toISOString() : undefined;
  }
}

export class ResponseMatchListDTO implements MatchList {
  entries: Match[];
  has_next: boolean;

  constructor(entriesList: EntriesList<MatchEntity>) {
    this.entries = entriesList.entries.map(
      (match) => new ResponseMatchDTO(match),
    );
    this.has_next = entriesList.has_next;
  }
}

export class CreateMatchDTO implements Match {
  host_player_id: number;
  guest_player_id?: number;
  result?: Result;
}
