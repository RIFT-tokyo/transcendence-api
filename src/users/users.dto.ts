import { PartialType } from '@nestjs/mapped-types';
import { User } from '../generated/model/models';
import { UserList } from '../generated/model/models';
import { User as EntityUser } from '../entities/user.entity';
import { Achievement as EntityAchievement } from '../entities/achievement.entity';
import { Achievement } from '../generated/model/models';
import { EntriesList } from '../types/EntriesList';

export class CreateUserDTO implements User {
  username: string;
  display_name?: string;
  profile_image?: string;
  status_message?: string;
  status?: User.StatusEnum;
  password?: string;
  intra_id?: number;
  is_two_fa_enabled?: boolean;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class ResponseUserDTO implements User {
  id: number;
  username: string;
  display_name: string;
  profile_image: string;
  status: User.StatusEnum;
  status_message: string;
  is_two_fa_enabled: boolean;
  followers?: number;
  following?: number;
  achievements?: Achievement[];
  created_at?: string;
  updated_at?: string;

  constructor(user: EntityUser) {
    this.id = user.id;
    this.username = user.username;
    this.display_name = user.display_name;
    this.profile_image = user.profile_image;
    this.status = user.status;
    this.status_message = user.status_message;
    this.is_two_fa_enabled = user.is_two_fa_enabled;
    this.followers = user.followers ? user.followers.length : undefined;
    this.following = user.following ? user.following.length : undefined;
    this.achievements = user.achievements
      ? user.achievements.map((achievement: EntityAchievement) => ({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          image: achievement.image,
          created_at: achievement.created_at.toISOString(),
          updated_at: achievement.updated_at.toISOString(),
        }))
      : undefined;
    this.created_at = user.created_at.toISOString();
    this.updated_at = user.updated_at.toISOString();
  }
}

export class ResponseUserListDTO implements UserList {
  entries: User[];
  has_next: boolean;

  constructor(entriesList: EntriesList<EntityUser>) {
    this.entries = entriesList.entries.map((user) => new ResponseUserDTO(user));
    this.has_next = entriesList.has_next;
  }
}
