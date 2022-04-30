import { Logger } from '@nestjs/common';
import { Match } from '../entities/match.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../entities/user.entity';
import * as Faker from 'faker/locale/ja';

export class AddDummyMatches implements Seeder {
  private readonly logger = new Logger('AddDummyMatches');

  public async run(_: Factory, connection: Connection): Promise<any> {
    const matches = [];
    const users = await connection.getRepository(User).find();

    for (let i = 0; i < 500; i++) {
      let host_player_points = Math.floor(Math.random() * 10);
      let guest_player_points = Math.floor(Math.random() * 10);
      let result = 'draw';
      if (host_player_points >= guest_player_points) {
        host_player_points = 11;
        result = 'host';
      } else if (host_player_points < guest_player_points) {
        guest_player_points = 11;
        result = 'guest';
      }
      const host_player_id = Math.floor(Math.random() * users.length) + 1;
      const guest_player_id = Math.floor(Math.random() * users.length) + 1;

      matches.push({
        host_player_points,
        guest_player_points,
        result,
        host_player: users.find((user) => user.id === host_player_id),
        guest_player: users.find((user) => user.id === guest_player_id),
        start_at: Faker.date.past(),
        end_at: Faker.date.recent(),
      });
    }
    await connection.getRepository(Match).insert(matches);
  }
}
