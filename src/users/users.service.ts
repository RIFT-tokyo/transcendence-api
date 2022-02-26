import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following', 'followers'] },
    );
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne(
      { username },
      { relations: ['following', 'followers'] },
    );
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['following', 'followers'],
    });
    return users;
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException();
    }
    return;
  }

  async updateUser(id: number, userData: UpdateUserDTO) {
    const result = await this.userRepository.update(id, userData);
    if (result.affected == 0) {
      throw new NotFoundException();
    }
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
      throw new NotFoundException();
    }
    return user.followers;
  }

  async getFollowing(id: number) {
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following'] },
    );
    if (!user) {
      throw new NotFoundException();
    }
    return user.following;
  }

  async follow(id: number, targetId: number) {
    if (id === targetId) {
      throw new NotFoundException();
    }
    const user = await this.userRepository.findOne(
      { id },
      { relations: ['following'] },
    );
    const targetUser = await this.userRepository.findOne(targetId);
    if (!user || !targetUser) {
      throw new NotFoundException();
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
    if (!user) {
      throw new NotFoundException();
    }
    const targetUserIndex = user.following.findIndex((u) => u.id === targetId);
    if (targetUserIndex < 0) {
      throw new NotFoundException();
    }
    user.following.splice(targetUserIndex, 1);
    const ret = await this.userRepository.save(user);
    return !!ret;
  }

  async isFollowing(id: number, targetId: number) {
    const followingUsers = await this.getFollowing(id);
    const ret = followingUsers.some((u) => u.id === targetId);
    if (!ret) {
      throw new NotFoundException();
    }
  }
}
