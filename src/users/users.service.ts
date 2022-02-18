import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async createHashedPassword(password: string) {
    if (password === undefined) {
      return null;
    }
    return await bcrypt.hash(password, Number(process.env.HASH_SALT));
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException();
    }
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    }));
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
    const user = await this.userRepository.findOne(id);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  async createUser(userData: CreateUserDTO) {
    const result = await this.userRepository.insert({
      ...userData,
      password: await this.createHashedPassword(userData.password),
    });
    const id = result.identifiers[0].id;
    const user = await this.userRepository.findOne(id);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  async getFollowers(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user.followers.map((u) => ({
      ...u,
      followers: u.followers.length,
      following: u.following.length,
    }));
  }

  async getFollowing(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user.following.map((u) => ({
      ...u,
      followers: u.followers.length,
      following: u.following.length,
    }));
  }

  async follow(id: number, targetId: number) {
    const user = await this.userRepository.findOne(id);
    const targetUser = await this.userRepository.findOne(targetId);
    if (!user || !targetUser) {
      throw new NotFoundException();
    }
    user.following.push(targetUser);
    const ret = await this.userRepository.save(user);
    return ret ? true : false;
  }

  async unFollow(id: number, targetId: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    const [targetUser] = user.following.filter((u) => u.id === targetId);
    if (!targetUser) {
      throw new NotFoundException();
    }
    const ret = user.following.splice(user.following.indexOf(targetUser), 1);
    return ret.length > 0;
  }

  async isFollowing(id: number, targetId: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user.following.some((u) => u.id === targetId);
  }
}
