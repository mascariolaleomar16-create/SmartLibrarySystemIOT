import { cloudinary } from "./cloudinary.config.js";

export const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, options);
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