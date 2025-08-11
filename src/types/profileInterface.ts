export interface ProfileInterface {
  id?: string;
  userId: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  address?: string;
  isVerified?: boolean;
  lastLogin?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface ProfileUpdateInterface {
  phone?: string;
  profilePicture?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  address?: string;
  isVerified?: boolean;
  lastLogin?: Date;
  isActive?: boolean;
}
