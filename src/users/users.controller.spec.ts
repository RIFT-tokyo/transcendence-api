import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/entities/user.entity';
import { ResponseUser } from 'src/generated/model/models';
import { Repository } from 'typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    repository = new Repository<User>();
    service = new UsersService(repository);
    controller = new UsersController(service);

    jest.spyOn(service, 'findAll').mockImplementation(() => {
      const user: User = {
        id: 1,
        name: 'Mock Name',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      };
      return Promise.resolve([user]);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/users', () => {
    it('should return users list', async () => {
      expect(await controller.index()).toEqual([
        {
          id: 1,
          name: 'Mock Name',
          created_at: '2019-08-24T14:15:22Z',
          updated_at: '2019-08-24T14:15:22Z',
        },
      ]);
    });

    it('should return users list', async () => {
      expect(await controller.index()).toHaveLength(1);
    });
  });
});
