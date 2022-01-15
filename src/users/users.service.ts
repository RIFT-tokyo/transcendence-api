import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

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

  async findAll() {
    return await this.userRepository.find();
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUser(id: number, user: Partial<User>) {
    return await this.userRepository.update(id, user);
  }

  async createUser(userData: Partial<User>): Promise<void> {
    await this.userRepository.insert({
      ...userData,
      password: this.createPasswordDigest(userData.password),
    });
    return;
  }
}
