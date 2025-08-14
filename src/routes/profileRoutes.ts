import { Router } from 'express';
import {
  createProfile,
  getProfile,
  getAllProfiles,
  updateProfile,
  patchProfile,
  deleteProfile,
  updateProfilePicture,
} from '../controllers/profileController';
import { upload } from '../utils/upload';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import { CreateProfileSchema, UpdateProfileSchema } from '../schema/profileSchema';

const profileRouter = Router();

// Create a new profile
profileRouter.post(
  '/profiles',
  authMiddleware,
  upload.single('profilePicture'),
  ValidationMiddleware({
    type: 'body',
    schema: CreateProfileSchema,
  }),
  createProfile,
);

// Get all profiles
profileRouter.get('/profiles', authMiddleware, checkRole(['admin']), getAllProfiles);

// Get profile by user ID
profileRouter.get('/profile', authMiddleware, getProfile);

// Update profile (PUT - full update)
profileRouter.put(
  '/profiles',
  authMiddleware,
  upload.single('profilePicture'),
  ValidationMiddleware({
    type: 'body',
    schema: UpdateProfileSchema,
  }),
  updateProfile,
);

// Update profile (PATCH - partial update)
profileRouter.patch(
  '/profiles',
  authMiddleware,
  upload.single('profilePicture'),
  ValidationMiddleware({
    type: 'body',
    schema: UpdateProfileSchema,
  }),
  patchProfile,
);

// Delete profile
profileRouter.delete('/profiles', authMiddleware, deleteProfile);

// Update profile picture only
profileRouter.patch(
  '/profiles/picture',
  authMiddleware,
  upload.single('profilePicture'),
  updateProfilePicture,
);

export { profileRouter };
