// utils/cloudinary-upload.js
import cloudinary from './cloudinary.js';
import streamifier from 'streamifier';

export const uploadBufferToCloudinary = (
  buffer,
  folder = process.env.CLOUDINARY_FOLDER || 'workeasy/profiles'
) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        overwrite: true,
        transformation: [
          { width: 512, height: 512, crop: 'fill', gravity: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
