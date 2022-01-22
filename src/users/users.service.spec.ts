import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    repository = new Repository<User>();
    service = new UsersService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
