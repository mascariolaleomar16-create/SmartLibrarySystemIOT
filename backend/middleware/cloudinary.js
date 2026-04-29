import { cloudinary } from "./cloudinary.config.js";

export const uploadToCloudinary = async (
  filePath,
  {
    folder = "library/books",
    width = 800,
    height = 1200,
    crop = "fill",
    gravity = "auto",
    ...options
  } = {}
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,

      transformation: [
        {
          width,
          height,
          crop,
          gravity,
        },
      ],

      ...options,
    });

    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
};