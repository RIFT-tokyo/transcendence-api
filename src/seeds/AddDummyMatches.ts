import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class AddDummyMatches implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    const matches = [];
    for (let i = 0; i < 1000; i++) {
      let host_player_points = Math.floor(Math.random() * 10);
      let guest_player_points = Math.floor(Math.random() * 10);
      let result = 'draw';
      if (host_player_points > guest_player_points) {
        host_player_points = 11;
        result = 'host';
      } else if (host_player_points < guest_player_points) {
        guest_player_points = 11;
        result = 'guest';
      }

      matches.push({
        hostPlayerId: Math.floor(Math.random() * 200) + 1,
        guestPlayerId: Math.floor(Math.random() * 200) + 1,
        host_player_points,
        guest_player_points,
        result,
        start_at: new Date(),
        end_at: new Date(),
      });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into('match')
      .values(matches)
      .execute();
  }
}
