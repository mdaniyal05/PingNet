const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    console.error(error);
    fs.unlinkSync(filePath);
    return null;
  }
};

module.exports = uploadFileOnCloudinary;
