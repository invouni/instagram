




const cloudinary = require("cloudinary").v2;
const configData = require("../src/config/config.js");
const fs = require("fs");

// Cloudinary configuration
const cloudinaryConfig = async () => {
  try {
    cloudinary.config({
      cloud_name: configData.CLOUDINARY_CLOUD_NAME,
      api_key: configData.CLOUDINARY_API_KEY,
      api_secret: configData.CLOUDINARY_API_SECRET,
    });
  } catch (error) {
    console.error("Cloudinary configuration error:", error);
  }
};

// Function to upload file to Cloudinary
const placeFileInCloudinary = async (file) => {
  if (!file) {
    return;
  }

  try {
    const response = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file); // Remove uploaded file from the server
    return response.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
};
// Function to upload a video and delete it from the server
async function uploadVideoToCloudinary(filePath) {
  try {
    // Upload the video
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "video" });
    

    // Delete the video from the server
    fs.promises.unlink(filePath)
    .then(() => {
      console.log("Removed")
    }).catch(error => {
      console.log(error)
    })
    
    return result.secure_url;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  cloudinaryConfig,
  placeFileInCloudinary,
  uploadVideoToCloudinary
};