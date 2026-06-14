import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `flikchat/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const publicId = url.split('/').slice(-2).join('/').split('.')[0];
  await cloudinary.uploader.destroy(`flikchat/${publicId}`);
};

export default cloudinary;
