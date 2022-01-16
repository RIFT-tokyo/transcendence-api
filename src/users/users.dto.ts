import { User } from '../generated/model/models';

export class CreateUserDTO implements Partial<User> {
  name: string;
}

export class UpdateUserDTO implements Partial<User> {
  name: string;
}
