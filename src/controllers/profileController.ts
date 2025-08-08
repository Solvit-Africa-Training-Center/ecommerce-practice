import { Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { ProfileInterface } from "../types/userInterface";
import {
  createProfile as createProfileService,
  getProfileByUserId,
  updateProfile as updateProfileService,
} from "../services/profileService";

interface IRequestProfileData extends Request {
  body: ProfileInterface;
  file?: Express.Multer.File;
}

export const createProfile = async (
  req: IRequestProfileData,
  res: Response,
) => {
  try {
    const profileData = req.body;
    const profile = await createProfileService(profileData, req.file);
    ResponseService({
      data: profile,
      message: "Profile created successfully",
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

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const profile = await getProfileByUserId(userId);

    if (!profile) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "Profile not found",
        res,
      });
    }

    ResponseService({
      data: profile,
      message: "Profile retrieved successfully",
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

export const updateProfile = async (
  req: IRequestProfileData,
  res: Response,
) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    const updatedProfile = await updateProfileService(
      userId,
      updateData,
      req.file,
    );
    if (!updatedProfile) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "Profile not found",
        res,
      });
    }

    ResponseService({
      data: updatedProfile,
      message: "Profile updated successfully",
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
