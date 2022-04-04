import { define } from 'typeorm-seeding';
import * as Faker from 'faker/locale/ja';

import { User } from '../entities/user.entity';

define(User, (faker: typeof Faker): User => {
  const user = new User();
  user.username = faker.internet.userName();
  user.display_name = faker.name.findName();
  user.status_message = faker.lorem.sentence();
  user.created_at = faker.date.past();
  user.updated_at = faker.date.recent();
  return user;
});

export default User;
