import { PartialType } from '@nestjs/mapped-types';
import { User } from '../generated/model/models';

export class CreateUserDTO implements User {
  username: string;
  display_name: string;
  profile_image: string;
  status_message?: string;
  password?: string;
  intra_id?: number;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
