import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { AppError } from './errorMiddleware';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on the route
    let folder = 'evolvix/general';
    if (req.baseUrl.includes('brands')) {
      folder = `evolvix/brands/${req.params.id}`;
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
    };
  },
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError('Only image files are allowed!', 400));
    }
    cb(null, true);
  }
});
