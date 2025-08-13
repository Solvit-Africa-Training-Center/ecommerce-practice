import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { ProfileInterface, ProfileUpdateInterface, GetProfile } from '../types/profileInterface';
import { IRequestUser } from '../middlewares/authMiddleware';
import {
  createProfile as createProfileService,
  getProfileByUserId,
  getAllProfiles as getAllProfilesService,
  updateProfile as updateProfileService,
  deleteProfile as deleteProfileService,
  updateProfilePicture as updateProfilePictureService,
} from '../services/profileService';

interface IRequestProfileData extends IRequestUser {
  body: ProfileInterface;
  file?: Express.Multer.File;
}

interface IRequestProfileUpdateData extends IRequestUser {
  body: ProfileUpdateInterface;
  file?: Express.Multer.File;
}

// Create a new profile
export const createProfile = async (req: IRequestProfileData, res: Response) => {
  try {
    const profileData: ProfileInterface = {
      ...req.body,
      userId: req.user?.id as string,
    };
    const profile = await createProfileService(profileData, req.file);
    ResponseService({
      data: profile,
      message: 'Profile created successfully',
      success: true,
      status: 201,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

// Get profile by user ID
export const getProfile = async (req: IRequestUser, res: Response) => {
  try {
    const profile = await getProfileByUserId(req.user?.id as string);

    if (!profile) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Profile not found',
        res,
      });
    }

    ResponseService({
      data: profile,
      message: 'Profile retrieved successfully',
      success: true,
      status: 200,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

// Get all profiles
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await getAllProfilesService();
    ResponseService({
      data: profiles,
      message: 'Profiles retrieved successfully',
      success: true,
      status: 200,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

// Update a profile (PUT - full update)
export const updateProfile = async (req: IRequestProfileUpdateData, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const updateData = req.body;
    const updatedProfile = await updateProfileService(userId, updateData, req.file);

    if (!updatedProfile) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Profile not found',
        res,
      });
    }

    ResponseService({
      data: updatedProfile,
      message: 'Profile updated successfully',
      success: true,
      status: 200,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

// Update a profile (PATCH - partial update)
export const patchProfile = async (req: IRequestProfileUpdateData, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const updateData = req.body;
    const updatedProfile = await updateProfileService(userId, updateData, req.file);

    if (!updatedProfile) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Profile not found',
        res,
      });
    }

    ResponseService({
      data: updatedProfile,
      message: 'Profile updated successfully',
      success: true,
      status: 200,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

// Delete a profile
export const deleteProfile = async (req: IRequestUser, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const deleted = await deleteProfileService(userId);

    if (!deleted) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Profile not found',
        res,
      });
    }

    ResponseService({
      data: null,
      message: 'Profile deleted successfully',
      success: true,
      status: 200,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

// Update profile picture only
export const updateProfilePicture = async (req: IRequestUser, res: Response) => {
  try {
    if (!req.file) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'No file uploaded',
        res,
      });
    }

    const userId = req.user?.id as string;
    const updatedProfile = await updateProfilePictureService(userId, req.file);

    if (!updatedProfile) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Profile not found',
        res,
      });
    }

    ResponseService({
      data: updatedProfile,
      message: 'Profile picture updated successfully',
      success: true,
      status: 200,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};
