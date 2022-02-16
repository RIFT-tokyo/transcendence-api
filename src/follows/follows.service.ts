import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async findAll() {
    return await this.followRepository.find();
  }

  async findFollowers(userId: number) {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
    });
    return follows.map((follow) => follow.followerId);
  }

  async findFollowing(userId: number) {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
    });
    return follows.map((follow) => follow.followingId);
  }

  async isFollowing(userId: number, targetUserId: number) {
    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: targetUserId },
    });
    return follow ? true : false;
  }

  async follow(userId: number, targetUserId: number) {
    const follow = new Follow();
    follow.followerId = userId;
    follow.followingId = targetUserId;
    return await this.followRepository.save(follow);
  }

  async unfollow(userId: number, targetUserId: number) {
    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: targetUserId },
    });
    if (!follow) {
      throw new NotFoundException();
    }
    return await this.followRepository.remove(follow);
  }
}
