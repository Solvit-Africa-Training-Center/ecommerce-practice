import { Router } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController";
import { storage } from "../utils/upload";

import multer from "multer";
const uploadMiddleware = multer({ storage });

const profileRouter = Router();

profileRouter.post(
  "/profiles",
  uploadMiddleware.single("profilePicture"),
  createProfile,
);
profileRouter.get("/profiles/:userId", getProfile);
profileRouter.put(
  "/profiles/:userId",
  uploadMiddleware.single("profilePicture"),
  updateProfile,
);

export { profileRouter };
