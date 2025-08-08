export interface ProfileInterface {
  id?: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  address?: string;
  roleId: string;
  isVerified: boolean;
  lastLogin?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}