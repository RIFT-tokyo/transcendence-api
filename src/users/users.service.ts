import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Like, Connection, Repository } from 'typeorm';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import * as bcrypt from 'bcrypt';
import { EntriesList } from '../types/EntriesList';
import { Achievement } from '../entities/achievement.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findUserById(id: number, relations: Array<string> = []) {
    return await this.userRepository.findOne({ id }, { relations });
  }

  async findUserByUsername(username: string, relations: Array<string> = []) {
    return await this.userRepository.findOne({ username }, { relations });
  }

  async findUsersByUsernameLike(pattern: string) {
    return await this.userRepository.find({ username: Like(pattern) });
  }

  async findUserByIntraId(intra_id: number, relations: Array<string> = []) {
    return await this.userRepository.findOne({ intra_id }, { relations });
  }

  async findAll(limit: number, offset?: number): Promise<EntriesList<User>> {
    const [users, count] = await this.userRepository.findAndCount({
      relations: ['following', 'followers'],
      skip: offset,
      take: limit,
    });
    const has_next = count > (offset ?? 0) + limit;
    return { entries: users, has_next };
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
    if (userData.display_name === '') {
      userData.display_name = null;
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

  async getFollowers(
    id: number,
    limit: number,
    offset?: number,
  ): Promise<EntriesList<User>> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return null;
    }
    const queryBuilder = this.connection
      .createQueryBuilder()
      .select('user_followers_user.userId_2 as user_id')
      .from('user_followers_user', 'user_followers_user')
      .where('user_followers_user.userId_1 = :id', { id });

    const rawData: { user_id: number }[] = await queryBuilder
      .limit(limit)
      .offset(offset)
      .getRawMany();
    const followersIds = rawData.map((obj) => obj.user_id);
    let followers = [];
    if (followersIds.length) {
      followers = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id IN (:...ids)', { ids: followersIds })
        .getMany();
    }

    const count = await queryBuilder.getCount();
    const has_next = count > (offset ?? 0) + limit;
    return { entries: followers, has_next };
  }

  async getFollowing(
    id: number,
    limit: number,
    offset?: number,
  ): Promise<EntriesList<User>> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return null;
    }
    const queryBuilder = await this.connection
      .createQueryBuilder()
      .select('user_followers_user.userId_1 as user_id')
      .from('user_followers_user', 'user_followers_user')
      .where('user_followers_user.userId_2 = :id', { id });

    const rawData: { user_id: number }[] = await queryBuilder
      .limit(limit)
      .offset(offset)
      .getRawMany();
    const followingIds = rawData.map((obj) => obj.user_id);
    let following = [];
    if (followingIds.length) {
      following = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id IN (:...ids)', { ids: followingIds })
        .getMany();
    }

    const count = await queryBuilder.getCount();
    const has_next = count > (offset ?? 0) + limit;
    return { entries: following, has_next };
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

  async getBlockUsers(id: number): Promise<User[]> {
    const user = await this.userRepository.findOne(id, {
      relations: ['block_users'],
    });
    if (!user) {
      return null;
    }
    return user.block_users;
  }

  async block(id: number, targetId: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['block_users'] },
    );
    const targetUser = await this.userRepository.findOne(targetId);
    if (!user || !targetUser) {
      return false;
    }
    user.block_users.push(targetUser);
    const ret = await this.userRepository.save(user);
    return !!ret;
  }

  async unBlock(id: number, targetId: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['block_users'] },
    );
    const targetUserIndex = user.block_users.findIndex(
      (u) => u.id === targetId,
    );
    if (targetUserIndex < 0) {
      return false;
    }
    user.block_users.splice(targetUserIndex, 1);
    const ret = await this.userRepository.save(user);
    return !!ret;
  }

  async isBlocking(id: number, targetId: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['block_users'] },
    );
    if (!user) {
      return null;
    }
    return user.block_users.some((u) => u.id === targetId);
  }

  async addAchievement(id: number, winCounts: number, loseCounts: number) {
    const user = await this.findUserById(id);
    const allAchievements = await this.achievementRepository.find();
    const targetAchievements = allAchievements.filter(
      (achievement: Achievement) => {
        if (
          achievement.condition_number < 0 &&
          achievement.condition_number >= -loseCounts
        ) {
          return true;
        }
        if (
          achievement.condition_number >= 0 &&
          achievement.condition_number <= winCounts
        ) {
          return true;
        }
        return false;
      },
    );
    user.achievements = targetAchievements;
    await this.userRepository.save(user);
  }
}
