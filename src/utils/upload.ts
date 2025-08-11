import multer from 'multer';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;
const cloudinary_api_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;

cloudinary.config({
  cloud_name: cloudinary_api_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
  secure: true,
});

// Upload file to Cloudinary
export const uploadFile = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided for upload'));
      return;
    }

    // Convert buffer to base64 for Cloudinary
    const base64Data = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64Data}`;

    cloudinary.uploader.upload(
      dataURI,
      {
        folder: 'ecommerce-profiles',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('No secure URL returned from Cloudinary'));
          return;
        }
        resolve(result.secure_url);
      },
    );
  });
};

// File filter for multer
const multerFilterFile = (req: any, file: any, cb: any) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Memory storage for multer (no local files)
export const storage = multer.memoryStorage();

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: multerFilterFile,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Alternative upload function for Cloudinary using buffer
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'ecommerce-profiles',
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
};
