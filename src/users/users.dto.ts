import { PartialType } from '@nestjs/mapped-types';
import { RequestUser } from '../generated/model/models';

export class CreateUserDTO implements RequestUser {
  name: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
