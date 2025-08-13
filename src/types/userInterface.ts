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

export type AddUserInterface = Omit<UserInterface, 'createdAt' | 'updatedAt'>;
export interface GetAllUsers {
  users: UserInterface[];
}
// coupon interface
export interface CouponAttributes {
  id: number;
  code: string;
  discount: number;
  isActive: boolean;
  expiredDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
