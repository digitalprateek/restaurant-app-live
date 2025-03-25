const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudApiKey,
  api_secret: process.env.cloudKeySecret,
});

module.exports = cloudinary;