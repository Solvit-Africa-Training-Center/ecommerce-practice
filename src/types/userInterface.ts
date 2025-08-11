import { ProfileCreationAttribute } from '../database/models/Profiles';
export interface UserInterface {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface ProfileInterface extends ProfileCreationAttribute {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

// export interface ProfileInterface {
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: null;
// }

export type AddUserInterface = Omit<UserInterface, 'createdAt' | 'updatedAt'>;
export interface GetAllUsers {
  users: UserInterface[];
}
