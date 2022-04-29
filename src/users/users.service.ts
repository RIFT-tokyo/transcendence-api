import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findUserById(id: number, relations: Array<string> = []) {
    return await this.userRepository.findOne({ id }, { relations });
  }

  async findUserByUsername(username: string, relations: Array<string> = []) {
    return await this.userRepository.findOne({ username }, { relations });
  }

  async findAll(limit: number, offset?: number) {
    return await this.userRepository.find({
      relations: ['following', 'followers'],
      skip: offset,
      take: limit,
    });
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUser(id: number, userData: UpdateUserDTO) {
    if (userData.password) {
      userData.password = await bcrypt.hash(
        userData.password,
        Number(process.env.HASH_SALT),
      );
    }
    await this.userRepository.update(id, userData);
    return await this.userRepository.findOne(
      { id },
      { relations: ['following', 'followers'] },
    );
  }

  async createUser(userData: CreateUserDTO) {
    if (userData.password) {
      userData.password = await bcrypt.hash(
        userData.password,
        Number(process.env.HASH_SALT),
      );
    }
    const result = await this.userRepository.insert(userData);
    const id = result.identifiers[0].id;
    return await this.userRepository.findOne(
      { id },
      { relations: ['following', 'followers'] },
    );
  }

  async getFollowers(id: number, limit: number, offset?: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return null;
    }
    const rawData = await this.connection.query(
      'SELECT "userId_2" FROM user_followers_user \
      WHERE "userId_1" = $1 LIMIT $2 OFFSET $3;',
      [id, limit, offset],
    );
    const followersIds = rawData.map((obj) => obj.userId_2);
    const followers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: followersIds })
      .getMany();
    return followers;
  }

  async getFollowing(id: number, limit: number, offset?: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return null;
    }
    const rawData = await this.connection.query(
      'SELECT "userId_1" FROM user_followers_user \
      WHERE "userId_2" = $1 LIMIT $2 OFFSET $3;',
      [id, limit, offset],
    );
    const followingIds = rawData.map((obj) => obj.userId_1);
    const following = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: followingIds })
      .getMany();
    return following;
  }

  async follow(id: number, targetId: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following'] },
    );
    const targetUser = await this.userRepository.findOne(targetId);
    if (!user || !targetUser) {
      return false;
    }
    user.following.push(targetUser);
    const ret = await this.userRepository.save(user);
    return !!ret;
  }

  async unFollow(id: number, targetId: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following'] },
    );
    const targetUserIndex = user.following.findIndex((u) => u.id === targetId);
    if (targetUserIndex < 0) {
      return false;
    }
    user.following.splice(targetUserIndex, 1);
    const ret = await this.userRepository.save(user);
    return !!ret;
  }

  async isFollowing(id: number, targetId: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following'] },
    );
    if (!user) {
      return null;
    }
    return user.following.some((u) => u.id === targetId);
  }
}
