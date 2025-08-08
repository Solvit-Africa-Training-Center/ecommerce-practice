import { Database } from "../database";
import { ProfileInterface } from "../types/userInterface";
import { ProfileCreationAttribute } from "../database/models/Profiles";

// Create a new profile
export async function createProfile(profileData: ProfileInterface): Promise<ProfileInterface> {
  try {
    const profile = await Database?.Profile.create(profileData);
    return profile.toJSON() as ProfileCreationAttribute;
  } catch (error) {
    throw error;
  }
}

// Get a profile by user ID
export async function getProfileByUserId(userId: string): Promise<ProfileInterface | null> {
  try {
    const profile = await Database.Profile.findOne({
      where: { userId },
      include: [
        {
          model: Database.User,
          as: 'user',
        },
        {
          model: Database.Role,
          as: 'role',
        },
      ],
    });
    return profile ? (profile.toJSON() as ProfileInterface) : null;
  } catch (error) {
    throw error;
  }
}

// Update a profile by user ID
export async function updateProfile(
  userId: string,
  updateData: Partial<ProfileInterface>
): Promise<ProfileInterface | null> {
  try {
    const [updated] = await Database.Profile.update(updateData, {
      where: { userId },
      returning: true,
    });

    if (updated) {
      const profile = await getProfileByUserId(userId);
      return profile;
    }
    return null;
  } catch (error) {
    throw error;
  }
}
