import { RequestUser, ResponseUser } from '../generated/model/models';

export class CreateUserDTO implements RequestUser {
  name: string;
}

export class UpdateUserDTO implements RequestUser {
  name: string;
}
