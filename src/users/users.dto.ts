import { PartialType } from '@nestjs/mapped-types';
import { RequestUser } from '../generated/model/models';

export class CreateUserDTO implements RequestUser {
  username: string;
  display_name: string;
  profile_image: string;
  status_message: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
