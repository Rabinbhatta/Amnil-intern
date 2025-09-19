import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
    console.log(`Image with public ID "${publicId}" deleted from Cloudinary.`);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    throw new Error("Cloudinary deletion failed");
  }
};

export const uploadToCloudinary = async (tempFilePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(tempFilePath);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};