import { Database } from "../database";
import { ProfileInterface } from "../types/userInterface";
import { ProfileCreationAttribute } from "../database/models/Profiles";
import { uploadFile } from "../utils/upload";

// Create a new profile
export async function createProfile(
  profileData: ProfileInterface,
  file?: Express.Multer.File,
): Promise<ProfileInterface> {
  try {
    if (file) {
      const imageUrl = await uploadFile(file);
      profileData.profilePicture = imageUrl;
    }

    if (!profileData.userId || !profileData.roleId) {
      throw new Error("userId and roleId are required");
    }

    const profile = await Database?.Profile.create(profileData);
    return profile.toJSON() as ProfileCreationAttribute;
  } catch (error) {
    throw error;
  }
}

export async function getProfileByUserId(
  userId: string,
): Promise<ProfileInterface | null> {
  try {
    const profile = await Database.Profile.findOne({
      where: { userId },
      include: [
        {
          model: Database.User,
          as: "user",
        },
        {
          model: Database.Role,
          as: "role",
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
  updateData: Partial<ProfileInterface>,
  file?: Express.Multer.File,
): Promise<ProfileInterface | null> {
  try {
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
  } catch (error) {
    throw error;
  }
}
