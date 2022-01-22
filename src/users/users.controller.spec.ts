import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersController } from './users.controller';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    repository = new Repository<User>();
    service = new UsersService(repository);
    controller = new UsersController(service);

    const users: User[] = [
      {
        id: 1,
        name: 'Kobuta',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      },
      {
        id: 2,
        name: 'Tanuki',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      },
      {
        id: 3,
        name: 'Kitsune',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      },
      {
        id: 4,
        name: 'Neko',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      },
    ];

    // mock service
    jest.spyOn(service, 'findAll').mockImplementation(() => {
      return Promise.resolve(users);
    });
    jest.spyOn(service, 'findUserById').mockImplementation((id: number) => {
      return Promise.resolve(users[id]);
    });
    jest.spyOn(service, 'deleteUser').mockImplementation((id: number) => {
      users.splice(id, 1);
      return Promise.resolve();
    });
    jest
      .spyOn(service, 'updateUser')
      .mockImplementation((id: number, userData: UpdateUserDTO) => {
        users[id].name = userData.name;
        return Promise.resolve(users[id]);
      });
    jest
      .spyOn(service, 'createUser')
      .mockImplementation((userData: CreateUserDTO) => {
        users.push({
          id: users.length + 1,
          name: userData.name,
          created_at: '2019-08-24T14:15:22Z',
          updated_at: '2019-08-24T14:15:22Z',
        });
        return Promise.resolve(users.slice(-1)[0]);
      });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users', () => {
    it('should return users list', async () => {
      expect(await controller.index()).toEqual([
        {
          id: 1,
          name: 'Kobuta',
          created_at: '2019-08-24T14:15:22Z',
          updated_at: '2019-08-24T14:15:22Z',
        },
        {
          id: 2,
          name: 'Tanuki',
          created_at: '2019-08-24T14:15:22Z',
          updated_at: '2019-08-24T14:15:22Z',
        },
        {
          id: 3,
          name: 'Kitsune',
          created_at: '2019-08-24T14:15:22Z',
          updated_at: '2019-08-24T14:15:22Z',
        },
        {
          id: 4,
          name: 'Neko',
          created_at: '2019-08-24T14:15:22Z',
          updated_at: '2019-08-24T14:15:22Z',
        },
      ]);
    });

    it('should return users list with length 4', async () => {
      expect(await controller.index()).toHaveLength(4);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user', async () => {
      expect(await controller.getUser(1)).toEqual({
        id: 2,
        name: 'Tanuki',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      expect(await controller.index()).toHaveLength(4);
      await controller.deleteUser(1);
      expect(await controller.index()).toHaveLength(3);
      await controller.deleteUser(2);
      expect(await controller.index()).toHaveLength(2);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user', async () => {
      expect(
        await controller.updateUser(1, { name: 'キタサンブラック' }),
      ).toEqual({
        id: 2,
        name: 'キタサンブラック',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      });
    });
  });

  describe('POST /users/:id', () => {
    it('should create user', async () => {
      expect(await controller.create({ name: 'ディープインパクト' })).toEqual({
        id: 5,
        name: 'ディープインパクト',
        created_at: '2019-08-24T14:15:22Z',
        updated_at: '2019-08-24T14:15:22Z',
      });
    });
  });
});
