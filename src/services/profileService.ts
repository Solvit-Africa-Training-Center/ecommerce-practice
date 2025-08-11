import { Database } from '../database';
import { ProfileInterface, ProfileUpdateInterface } from '../types/profileInterface';
import { ProfileCreationAttribute, Profile } from '../database/models/Profiles';
import { uploadFile } from '../utils/upload';

export async function createProfile(
  profileData: ProfileInterface,
  file?: Express.Multer.File,
): Promise<ProfileInterface> {
  if (file) {
    const imageUrl = await uploadFile(file);
    profileData.profilePicture = imageUrl;
  }

  if (!profileData.userId) {
    throw new Error('userId is required');
  }

  const existingProfile = await Database?.Profile.findOne({
    where: { userId: profileData.userId },
  });

  if (existingProfile) {
    throw new Error('Profile already exists for this user');
  }

  const profileToCreate = {
    ...profileData,
    isActive: profileData.isActive ?? true,
    isVerified: profileData.isVerified ?? false,
  };

  const profile = await Database?.Profile.create(profileToCreate);
  return profile.toJSON() as ProfileInterface;
}

export async function getProfileByUserId(userId: string): Promise<ProfileInterface | null> {
  const profile = await Database.Profile.findOne({
    where: { userId },
    include: [
      {
        model: Database.User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'roleId'],
      },
    ],
  });
  return profile ? (profile.toJSON() as ProfileInterface) : null;
}

export async function getAllProfiles(): Promise<ProfileInterface[]> {
  const profiles = await Database.Profile.findAll({
    include: [
      {
        model: Database.User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'roleId'],
      },
    ],
  });
  return profiles.map((profile) => profile.toJSON() as ProfileInterface);
}

export async function updateProfile(
  userId: string,
  updateData: ProfileUpdateInterface,
  file?: Express.Multer.File,
): Promise<ProfileInterface | null> {
  if (file) {
    const imageUrl = await uploadFile(file);
    updateData.profilePicture = imageUrl;
  }

  const [updated] = await Database.Profile.update(updateData, {
    where: { userId },
    returning: true,
  });

  if (updated) {
    const profile = await getProfileByUserId(userId);
    return profile;
  }
  return null;
}

export async function deleteProfile(userId: string): Promise<boolean> {
  const deleted = await Database.Profile.destroy({
    where: { userId },
  });
  return deleted > 0;
}

export async function updateProfilePicture(
  userId: string,
  file: Express.Multer.File,
): Promise<ProfileInterface | null> {
  const imageUrl = await uploadFile(file);

  const [updated] = await Database.Profile.update(
    { profilePicture: imageUrl },
    {
      where: { userId },
      returning: true,
    },
  );

  if (updated) {
    const profile = await getProfileByUserId(userId);
    return profile;
  }
  return null;
}
