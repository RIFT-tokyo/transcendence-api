import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';

const SALT = '12345';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private createPasswordDigest(password: string) {
    return crypto
      .createHash('sha256')
      .update(SALT + '/' + password)
      .digest('hex');
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException();
    }

    return;
  }

  async updateUser(id: number, user: UpdateUserDTO) {
    const result = await this.userRepository.update(id, user);
    if (result.affected == 0) {
      throw new NotFoundException();
    }

    return await this.userRepository.findOne(id);
  }

  async createUser(userData: CreateUserDTO) {
    const result = await this.userRepository.insert({
      ...userData,
      password: 'password',
    });
    const id = result.identifiers[0].id;

    return await this.userRepository.findOne(id);
  }
}
