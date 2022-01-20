import { RequestUser, ResponseUser } from '../generated/model/models';

export class CreateUserDTO implements RequestUser {
  name: string;
}

export class UpdateUserDTO implements RequestUser {
  name: string;
}


export class ResponseUserDTO implements ResponseUser {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
