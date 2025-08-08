export interface UserInterface {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface ProfileInterface {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface AddUserInterface
  extends Omit<UserInterface, "createdAt" | "updatedAt"> {}
export interface GetAllUsers {
  users: UserInterface[];
}
