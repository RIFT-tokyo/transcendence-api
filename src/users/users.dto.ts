import { PartialType } from '@nestjs/mapped-types';
import { User } from '../generated/model/models';

export class CreateUserDTO implements User {
  username: string;
  display_name?: string;
  profile_image?: string;
  status_message?: string;
  password?: string;
  intra_id?: number;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class ResponseUserDTO {
  id: number;
  username: string;
  display_name: string;
  profile_image: string;
  status: User.StatusEnum;
  status_message: string;
  followers?: number;
  following?: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.display_name = user.display_name;
    this.profile_image = user.profile_image;
    this.status = user.status;
    this.status_message = user.status_message;
    this.followers = user.followers;
    this.following = user.following;
    this.created_at = new Date(user.created_at);
    this.updated_at = new Date(user.updated_at);
  }
}
