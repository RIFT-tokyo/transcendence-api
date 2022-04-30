import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import User from '../factories/user.factory';

export class CreateDummyUsers implements Seeder {
  private readonly logger = new Logger('CreateDummyUsers');
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const count = 500;
    const combinations = [];
    try {
      await factory(User)().createMany(count);
    } catch (e) {
      this.logger.error(e);
    }

    const max_id = await connection
      .getRepository(User)
      .createQueryBuilder()
      .select('MAX(id)', 'max_id')
      .getRawOne();
    const max_id_number = max_id.max_id;

    for (let i = 0; i < count * 20; i++) {
      const id1 = Math.floor(Math.random() * max_id_number) + 1;
      const id2 = Math.floor(Math.random() * max_id_number) + 1;
      if (id1 === id2) {
        continue;
      }
      if (!combinations.some((c) => c.id1 === id1 && c.id2 === id2)) {
        combinations.push({ userId_1: id1, userId_2: id2 });
      }
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into('user_followers_user')
      .values(combinations)
      .orIgnore()
      .execute();
  }
}
