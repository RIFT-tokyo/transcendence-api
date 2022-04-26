import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import User from '../factories/user.factory';

export class CreateDummyUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const count = 200;
    const combinations = [];
    await factory(User)().createMany(count);

    for (let i = 0; i < count * 20; i++) {
      const id1 = Math.floor(Math.random() * count) + 1;
      const id2 = Math.floor(Math.random() * count) + 1;
      if (!combinations.some((c) => c.id1 === id1 && c.id2 === id2)) {
        try {
          await connection
            .createQueryBuilder()
            .insert()
            .into('user_followers_user')
            .values({
              userId_1: id1,
              userId_2: id2,
            })
            .execute();
          combinations.push({ id1, id2 });
        } catch (e) {}
      }
    }
  }
}
