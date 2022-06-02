import { Role } from '../entities/role.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class AddRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const roles: Partial<Role>[] = [
      {
        name: 'owner',
      },
      {
        name: 'administrator',
      },
    ];
    await connection.getRepository(Role).insert(roles);
  }
}
