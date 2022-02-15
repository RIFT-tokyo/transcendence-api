import { PartialType } from '@nestjs/mapped-types';
import { RequestUser } from '../generated/model/models';

export class CreateUserDTO implements RequestUser {
  username: string;
  display_name: string;
  profile_image: string;
  password?: string;
  intra_id?: number;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
