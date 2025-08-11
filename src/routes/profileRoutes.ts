import { Router } from "express";
import {
  createProfile,
  getProfile,
  getAllProfiles,
  updateProfile,
  patchProfile,
  deleteProfile,
  updateProfilePicture,
} from "../controllers/profileController";
import { upload } from "../utils/upload";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  ProfileParamsSchema,
} from "../schema/userSchema";

const profileRouter = Router();

// Create a new profile
profileRouter.post(
  "/profiles",
  upload.single("profilePicture"),
  ValidationMiddleware({
    type: "body",
    schema: CreateProfileSchema,
  }),
  createProfile,
);

// Get all profiles
profileRouter.get("/profiles", getAllProfiles);

// Get profile by user ID
profileRouter.get(
  "/profiles/:userId",
  ValidationMiddleware({
    type: "params",
    schema: ProfileParamsSchema,
  }),
  getProfile,
);

// Update profile (PUT - full update)
profileRouter.put(
  "/profiles/:userId",
  upload.single("profilePicture"),
  ValidationMiddleware({
    type: "params",
    schema: ProfileParamsSchema,
  }),
  ValidationMiddleware({
    type: "body",
    schema: UpdateProfileSchema,
  }),
  updateProfile,
);

// Update profile (PATCH - partial update)
profileRouter.patch(
  "/profiles/:userId",
  upload.single("profilePicture"),
  ValidationMiddleware({
    type: "params",
    schema: ProfileParamsSchema,
  }),
  ValidationMiddleware({
    type: "body",
    schema: UpdateProfileSchema,
  }),
  patchProfile,
);

// Delete profile
profileRouter.delete(
  "/profiles/:userId",
  ValidationMiddleware({
    type: "params",
    schema: ProfileParamsSchema,
  }),
  deleteProfile,
);

// Update profile picture only
profileRouter.patch(
  "/profiles/:userId/picture",
  upload.single("profilePicture"),
  ValidationMiddleware({
    type: "params",
    schema: ProfileParamsSchema,
  }),
  updateProfilePicture,
);

export { profileRouter };
