import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserById(id: number) {
    return await this.userRepository.findOne(
      { id },
      { relations: ['following', 'followers'] },
    );
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne(
      { username },
      { relations: ['following', 'followers'] },
    );
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['following', 'followers'],
    });
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUser(id: number, userData: UpdateUserDTO) {
    await this.userRepository.update(id, userData);
    return await this.userRepository.findOne(
      { id },
      { relations: ['following', 'followers'] },
    );
  }

  async createUser(userData: CreateUserDTO) {
    const result = await this.userRepository.insert(userData);
    const id = result.identifiers[0].id;
    return await this.userRepository.findOne(
      { id },
      { relations: ['following', 'followers'] },
    );
  }

  async getFollowers(id: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['followers'] },
    );
    if (!user) {
      return null;
    }
    return user.followers;
  }

  async getFollowing(id: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following'] },
    );
    if (!user) {
      return null;
    }
    return user.following;
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
    const followingUsers = await this.getFollowing(id);
    return followingUsers.some((u) => u.id === targetId);
  }
}
